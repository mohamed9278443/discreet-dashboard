import React, { useState, useEffect, useCallback } from 'react';
import {
  QrCode, Receipt, ListTodo, LayoutGrid,
  Languages, ChevronUp, Check, Vibrate
} from 'lucide-react';

const MainScreen = () => {
  const [activeTab, setActiveTab] = useState('Accueil');
  const [isDiscreet, setIsDiscreet] = useState(true);
  const [modalAction, setModalAction] = useState<'activate' | 'deactivate' | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [showShakeTooltip, setShowShakeTooltip] = useState(true);

  const isLockedRef = React.useRef(false);
  const lastShakeRef = React.useRef({ x: 0, y: 0, z: 0, time: 0 });

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  }, []);

  const handleToggleDiscreet = useCallback(() => {
    if (isLockedRef.current) return;
    setModalAction((prev) => {
      if (prev !== null) return prev;
      return isDiscreet ? 'deactivate' : 'activate';
    });
  }, [isDiscreet]);

  const closeAndLock = () => {
    setModalAction(null);
    isLockedRef.current = true;
    setTimeout(() => {
      isLockedRef.current = false;
      lastShakeRef.current = { x: 0, y: 0, z: 0, time: 0 };
    }, 1000);
  };

  const confirmAction = () => {
    if (modalAction === 'deactivate') {
      setIsDiscreet(false);
      setShowShakeTooltip(false);
      showToast('Vous quittez le mode discret !');
    } else if (modalAction === 'activate') {
      setIsDiscreet(true);
      showToast('Vous passez en mode discret !');
    }
    closeAndLock();
  };

  const cancelAction = () => {
    closeAndLock();
  };

  useEffect(() => {
    const threshold = 2500;
    const handleMotion = (e: DeviceMotionEvent) => {
      if (modalAction !== null || isLockedRef.current) return;
      const current = e.accelerationIncludingGravity;
      if (!current || current.x === null) return;

      const currentTime = new Date().getTime();
      const last = lastShakeRef.current;
      if (last.time === 0) {
        last.x = current.x;
        last.y = current.y || 0;
        last.z = current.z || 0;
        last.time = currentTime;
        return;
      }
      const diffTime = currentTime - last.time;
      if (diffTime > 100) {
        const deltaX = current.x - last.x;
        const deltaY = (current.y || 0) - last.y;
        const deltaZ = (current.z || 0) - last.z;
        const speed = Math.abs(deltaX + deltaY + deltaZ) / diffTime * 10000;
        if (speed > threshold) {
          handleToggleDiscreet();
          isLockedRef.current = true;
        }
        last.x = current.x;
        last.y = current.y || 0;
        last.z = current.z || 0;
        last.time = currentTime;
      }
    };
    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [handleToggleDiscreet, modalAction]);

  useEffect(() => {
    if (showShakeTooltip) {
      const timer = setTimeout(() => setShowShakeTooltip(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showShakeTooltip]);

  return (
    /**
     * ===== الحاوية الرئيسية =====
     * max-w-md: العرض الأقصى للتطبيق (448px) — غيّره لتوسيع/تضييق التطبيق
     * min-h-[100dvh]: ارتفاع الشاشة الكاملة
     * pb-16: مسافة سفلية لتجنب تداخل المحتوى مع شريط التنقل السفلي — زِدها أو أنقصها حسب ارتفاع الشريط
     * bg-[#fafafa]: لون الخلفية الرئيسي
     */
    <div className="w-full max-w-md mx-auto min-h-[100dvh] bg-[#fafafa] relative pb-16 font-sans animate-in fade-in duration-500 shadow-2xl sm:border-x sm:border-gray-100">

      {/* ===== إشعارات علوية (Toast & Shake Tooltip) ===== */}
      {/* top-10: المسافة من الأعلى — غيّرها لتحريك الإشعار لأعلى/أسفل */}
      <div className="fixed top-10 left-0 right-0 z-50 flex flex-col items-center space-y-2 px-4 pointer-events-none">
        {showShakeTooltip && isDiscreet && !toastMsg && (
          <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center space-x-3 w-full max-w-[360px] animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-auto">
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <Vibrate className="w-6 h-6 text-gray-800" strokeWidth={1.5} />
            </div>
            <span className="text-[13px] font-medium text-black leading-snug">
              Secouez votre téléphone pour quitter le mode discret.
            </span>
          </div>
        )}
        {toastMsg && (
          <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center space-x-3 w-full max-w-[360px] animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-auto">
            <div className="w-6 h-6 rounded-full bg-[#84cc16] flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            </div>
            <span className="text-[14px] font-medium text-black">{toastMsg}</span>
          </div>
        )}
      </div>

      {/* ===== نافذة تأكيد الوضع الخفي (Modal) ===== */}
      {modalAction !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/40 transition-opacity" onClick={cancelAction}></div>
          <div className="bg-white rounded-[24px] w-full max-w-[340px] p-6 relative z-10 animate-in zoom-in-95 duration-200 shadow-2xl">
            <h3 className="text-[19px] font-medium text-black mb-3">Mode discret</h3>
            <p className="text-[15px] text-gray-700 leading-relaxed mb-8">
              {modalAction === 'deactivate'
                ? "Souhaitez-vous quitter le mode discret ? Le montant de vos transactions et les soldes de vos comptes ne seront plus masqués."
                : "Souhaitez-vous activer le mode discret ? Le montant de vos transactions et les soldes de vos comptes seront masqués."}
            </p>
            <div className="flex justify-end space-x-6">
              <button onClick={cancelAction} className="text-[#00bfa5] font-semibold text-[14px] tracking-wide uppercase">
                Annuler
              </button>
              <button onClick={confirmAction} className="text-[#00bfa5] font-semibold text-[14px] tracking-wide uppercase">
                {modalAction === 'deactivate' ? 'Désactiver' : 'Activer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/**
       * ===== أيقونة QR Code =====
       * pt-6: المسافة من الأعلى — زِدها لدفع الأيقونة للأسفل
       * px-5: المسافة الأفقية من الجوانب
       * w-9 h-9: حجم الأيقونة — غيّرها لتكبير/تصغير
       * border-[2px]: سمك الإطار — غيّره لجعل الحدود أسمك/أرفع
       * rounded-lg: استدارة الزوايا
       */}
      <div className="pt-6 px-5 pb-3">
        <div className="inline-block p-1 border-[2px] border-[#00bfa5] rounded-lg bg-white">
          <QrCode className="w-9 h-9 text-black" strokeWidth={1.5} />
        </div>
      </div>

      {/**
       * ===== بطاقة معلومات المستخدم (الاسم + الرصيد) =====
       * px-5: المسافة الأفقية — غيّرها لتوسيع/تضييق المسافة من الجوانب
       * mb-5: المسافة السفلية بين هذه البطاقة وشبكة الخدمات — زِدها لزيادة المسافة
       * rounded-2xl: استدارة زوايا البطاقة — جرّب rounded-3xl لزوايا أكبر
       * p-4: الحشو الداخلي للبطاقة — غيّره لتوسيع/تضييق المحتوى داخل البطاقة
       * shadow-[...]: ظل البطاقة — غيّر القيم لجعله أقوى/أخف
       * text-[16px]: حجم خط الاسم — غيّره لتكبير/تصغير
       * text-[13px]: حجم خط رقم الهاتف
       */}
      <div className="px-5 mb-5">
        <div className="bg-white rounded-2xl p-4 shadow-[0_1px_12px_rgba(0,0,0,0.06)] flex justify-between items-start">
          <div className="flex-1 pr-2">
            <h2 className="text-[16px] font-semibold text-gray-900 leading-tight tracking-tight">Cheikh Sidiya Moubareckou</h2>
            <p className="text-gray-500 text-[13px] mt-1 tracking-wider">
              {isDiscreet ? '+222 ** ** ** **' : '+222 49 05 51 37'}
            </p>
          </div>
          {/**
           * ===== الرصيد =====
           * text-[20px]: حجم خط **** في الوضع الخفي
           * text-[15px]: حجم خط المبلغ عند الإظهار
           * text-[13px]: حجم خط "MRU"
           */}
          <div className="text-right flex items-center pt-0.5 shrink-0">
            {isDiscreet ? (
              <>
                <span className="text-gray-400 text-[20px] leading-none mt-0.5">****</span>
                <span className="text-gray-500 font-semibold ml-1 text-[13px]">MRU</span>
              </>
            ) : (
              <>
                <span className="text-gray-600 text-[15px] font-semibold leading-none mt-0.5">100 000 005</span>
                <span className="text-gray-500 font-semibold ml-1 text-[13px]">MRU</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/**
       * ===== شبكة الخدمات الرئيسية (6 أزرار) =====
       * px-5: المسافة الأفقية — نفس المسافة كباقي العناصر لضمان التناسق
       * gap-3: المسافة بين البطاقات — زِدها/أنقصها لتباعد/تقريب البطاقات
       * grid-cols-2: عدد الأعمدة — غيّره لعرض 3 بطاقات في الصف مثلاً
       * rounded-2xl: استدارة زوايا كل بطاقة
       * p-3.5: الحشو الداخلي لكل بطاقة — غيّره لتوسيع/تضييق المحتوى
       * shadow-[...]: ظل البطاقة
       * w-11 h-11: حجم الأيقونة — غيّره لتكبير/تصغير الأيقونة
       * rounded-xl: استدارة زوايا مربع الأيقونة
       * text-[13px]: حجم خط النص — غيّره لتكبير/تصغير اسم الخدمة
       */}
      <div className="px-5">
        <div className="grid grid-cols-2 gap-3">
          {/* بطاقة: Transfert d'argent */}
          <div className="bg-white rounded-2xl p-3.5 shadow-[0_1px_12px_rgba(0,0,0,0.06)] flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-[#10b981] flex items-center justify-center shrink-0 overflow-hidden">
              <img src="https://files.catbox.moe/6lqgx7.jpg" alt="Transfert d'argent" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <span className="text-[13px] font-medium text-gray-600 leading-[1.3]">Transfert<br/>d'argent</span>
          </div>
          {/* بطاقة: Paiement Commerçant */}
          <div className="bg-white rounded-2xl p-3.5 shadow-[0_1px_12px_rgba(0,0,0,0.06)] flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-[#38bdf8] flex items-center justify-center shrink-0 overflow-hidden">
              <img src="https://files.catbox.moe/96v1sg.jpg" alt="Paiement Commerçant" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <span className="text-[13px] font-medium text-gray-600 leading-[1.3]">Paiement<br/>Commerçant</span>
          </div>
          {/* بطاقة: Paiement Factures */}
          <div className="bg-white rounded-2xl p-3.5 shadow-[0_1px_12px_rgba(0,0,0,0.06)] flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-[#6366f1] flex items-center justify-center shrink-0 overflow-hidden">
              <img src="https://files.catbox.moe/ey4ss4.jpg" alt="Paiement Factures" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <span className="text-[13px] font-medium text-gray-600 leading-[1.3]">Paiement<br/>Factures</span>
          </div>
          {/* بطاقة: Recharge téléphonique */}
          <div className="bg-white rounded-2xl p-3.5 shadow-[0_1px_12px_rgba(0,0,0,0.06)] flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-[#a855f7] flex items-center justify-center shrink-0 overflow-hidden">
              <img src="https://files.catbox.moe/brlzo8.jpg" alt="Recharge téléphonique" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <span className="text-[13px] font-medium text-gray-600 leading-[1.3]">Recharge<br/>téléphonique</span>
          </div>
          {/* بطاقة: Recharge compte */}
          <div className="bg-white rounded-2xl p-3.5 shadow-[0_1px_12px_rgba(0,0,0,0.06)] flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-[#f87171] flex items-center justify-center shrink-0 overflow-hidden">
              <img src="https://files.catbox.moe/s463xg.jpg" alt="Recharge compte" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <span className="text-[13px] font-medium text-gray-600 leading-[1.3]">Recharge<br/>compte</span>
          </div>
          {/* بطاقة: Retrait d'argent */}
          <div className="bg-white rounded-2xl p-3.5 shadow-[0_1px_12px_rgba(0,0,0,0.06)] flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-[#fbbf24] flex items-center justify-center shrink-0 overflow-hidden">
              <img src="https://files.catbox.moe/id7b1o.jpg" alt="Retrait d'argent" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <span className="text-[13px] font-medium text-gray-600 leading-[1.3]">Retrait d'argent</span>
          </div>
        </div>
      </div>

      {/**
       * ===== قسم "Autres" (Agences Masrvi + Relevés de compte) =====
       * mt-5: المسافة العلوية من شبكة الخدمات — زِدها لدفعها للأسفل
       * mb-4: المسافة السفلية — تتحكم في المسافة بين هذا القسم والشريط السفلي
       *        القيمة الحالية مصممة ليكون القسم قريباً من الشريط السفلي
       * gap-3: المسافة بين بطاقتي Agences و Relevés
       * text-[13px]: حجم عنوان "Autres"
       */}
      <div className="px-5 mt-5">
        <h3 className="text-gray-500 text-[13px] font-medium mb-3 px-1">Autres</h3>
        <div className="grid grid-cols-2 gap-3">
          {/* بطاقة: Agences Masrvi */}
          <div className="bg-white rounded-2xl p-3.5 shadow-[0_1px_12px_rgba(0,0,0,0.06)] flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-[#f59e0b] flex items-center justify-center shrink-0 overflow-hidden">
              <img src="https://files.catbox.moe/395dtl.jpg" alt="Agences Masrvi" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <span className="text-[13px] font-medium text-gray-600 leading-[1.3]">Agences<br/>Masrvi</span>
          </div>
          {/* بطاقة: Relevés de compte (معطّلة — شفافية أقل) */}
          <div className="bg-white/40 rounded-2xl p-3.5 shadow-[0_1px_8px_rgba(0,0,0,0.02)] flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-[#a7f3d0] flex items-center justify-center shrink-0 opacity-50">
              <Receipt className="w-[18px] h-[18px] text-white" strokeWidth={2} />
            </div>
            <span className="text-[13px] font-medium text-gray-300 leading-[1.3]">Relevés de<br/>compte</span>
          </div>
        </div>
      </div>

      {/**
       * ===== شريط التنقل السفلي =====
       * fixed bottom-0: مثبّت أسفل الشاشة دائماً
       * py-2.5: المسافة العمودية الداخلية — غيّرها لتغيير ارتفاع الشريط
       * pb-safe: مسافة أمان لأجهزة بها شريط سفلي (مثل iPhone)
       * w-5 h-5: حجم الأيقونات — غيّرها لتكبير/تصغير أيقونات التنقل
       * text-[10px]: حجم خط أسماء التبويبات
       * text-[#00bfa5]: لون التبويب النشط
       * text-gray-500: لون التبويب غير النشط
       */}
      <div className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white border-t border-gray-100 flex justify-around items-center px-4 py-2.5 pb-safe z-50 sm:border-x">
        <div className="flex flex-col items-center space-y-0.5 w-14 cursor-pointer" onClick={() => setActiveTab('Accueil')}>
          <div className="w-5 h-5 flex items-center justify-center">
            <img src={activeTab === 'Accueil' ? "https://files.catbox.moe/6uq1ht.jpg" : "https://files.catbox.moe/itum37.jpg"} alt="Accueil" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          </div>
          <span className={`text-[10px] ${activeTab === 'Accueil' ? 'font-semibold text-[#00bfa5]' : 'font-medium text-gray-500'}`}>Accueil</span>
        </div>
        <div className="flex flex-col items-center space-y-0.5 w-14 cursor-pointer" onClick={() => setActiveTab('Produits')}>
          <ListTodo className={`w-5 h-5 ${activeTab === 'Produits' ? 'text-[#00bfa5]' : 'text-gray-500'}`} strokeWidth={2} />
          <span className={`text-[10px] ${activeTab === 'Produits' ? 'font-semibold text-[#00bfa5]' : 'font-medium text-gray-500'}`}>Produits</span>
        </div>
        <div className="flex flex-col items-center space-y-0.5 w-14 cursor-pointer" onClick={() => setActiveTab('Menu')}>
          <LayoutGrid className={`w-5 h-5 ${activeTab === 'Menu' ? 'text-[#00bfa5]' : 'text-gray-500'}`} strokeWidth={2} />
          <span className={`text-[10px] ${activeTab === 'Menu' ? 'font-semibold text-[#00bfa5]' : 'font-medium text-gray-500'}`}>Menu</span>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [appState, setAppState] = useState('green');

  useEffect(() => {
    if (appState === 'green') {
      const timer = setTimeout(() => setAppState('white'), 2000);
      return () => clearTimeout(timer);
    }
    if (appState === 'white') {
      const timer = setTimeout(() => setAppState('login'), 2500);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  if (appState === 'green') {
    return (
      <div className="w-full max-w-md mx-auto h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden animate-in fade-in duration-300 sm:shadow-2xl sm:border-x sm:border-gray-100">
        <div className="absolute inset-0 z-0" style={{ backgroundImage: `url('https://files.catbox.moe/jd1pg1.jpg')`, backgroundSize: '100000% 100000%', backgroundPosition: '0% 0%' }} />
        <img src="https://files.catbox.moe/jd1pg1.jpg" alt="Masrvi Logo Green" className="w-64 object-contain z-10" referrerPolicy="no-referrer" />
        <img src="https://files.catbox.moe/u9gug3.jpg" alt="Masrvi Splash Shape" className="w-48 object-contain mt-12 z-10" referrerPolicy="no-referrer" />
      </div>
    );
  }

  if (appState === 'white') {
    return (
      <div className="w-full max-w-md mx-auto h-[100dvh] bg-white flex flex-col items-center justify-center relative animate-in fade-in duration-300 sm:shadow-2xl sm:border-x sm:border-gray-100">
        <img src="https://files.catbox.moe/pv561j.jpg" alt="Masrvi Logo" className="w-64 object-contain mb-12" referrerPolicy="no-referrer" />
        <div className="w-8 h-8 border-[3px] border-[#00dca0] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (appState === 'login') {
    return (
      <div className="w-full max-w-md mx-auto h-[100dvh] bg-white flex flex-col relative font-sans animate-in fade-in duration-500 sm:shadow-2xl sm:border-x sm:border-gray-100">
        <div className="absolute top-6 right-6 flex flex-col items-center text-[#00dca0] cursor-pointer">
          <Languages className="w-7 h-7 mb-0.5" strokeWidth={1.5} />
          <span className="text-[11px] font-medium">Langue</span>
        </div>
        <div className="flex-1 flex items-center justify-center pb-10">
          <img src="https://files.catbox.moe/pv561j.jpg" alt="Masrvi Logo" className="w-64 object-contain" referrerPolicy="no-referrer" />
        </div>
        <div className="w-full rounded-t-[32px] px-6 py-8 flex flex-col items-center shadow-[0_-10px_40px_rgba(0,220,160,0.2)] relative overflow-hidden">
          <div className="absolute inset-0 z-0" style={{ backgroundImage: `url('https://files.catbox.moe/jd1pg1.jpg')`, backgroundSize: '100000% 100000%', backgroundPosition: '0% 0%' }} />
          <div className="relative z-10 flex flex-col items-center w-full">
            <p className="text-white text-center text-[17px] font-medium mb-8 leading-snug">
              Bienvenue Cheikh Sidiya Moubareckou<br/>Elhousseine !
            </p>
            <button onClick={() => setAppState('main')} className="w-full bg-white text-black font-semibold py-3.5 rounded-xl mb-4 shadow-sm hover:bg-gray-50 transition-colors">
              Connexion
            </button>
            <button className="w-full bg-white text-black font-semibold py-3.5 rounded-xl mb-8 shadow-sm hover:bg-gray-50 transition-colors">
              Supprimer le profil
            </button>
            <div className="flex flex-col items-center text-white mt-2 cursor-pointer opacity-90 hover:opacity-100">
              <ChevronUp className="w-5 h-5 mb-0.5" strokeWidth={2.5} />
              <span className="text-[13px] font-medium tracking-wide">Contact et informations</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <MainScreen />;
}
