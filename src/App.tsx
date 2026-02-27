/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║                    دليل التحكم الكامل                          ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * [span_6](start_span)║  🔹 تحريك عنصر للأسفل: زِد قيمة mt-X أو pt-X                  ║[span_6](end_span)
 * [span_7](start_span)║  🔹 تحريك عنصر للأعلى: أنقص قيمة mt-X أو pt-X                 ║[span_7](end_span)
 * [span_8](start_span)║  🔹 تحريك عنصر لليمين: زِد ml-X أو pl-X                       ║[span_8](end_span)
 * [span_9](start_span)║  🔹 تحريك عنصر لليسار: زِد mr-X أو pr-X                       ║[span_9](end_span)
 * [span_10](start_span)║  🔹 تكبير عنصر: زِد w-X و h-X                                 ║[span_10](end_span)
 * [span_11](start_span)║  🔹 تصغير عنصر: أنقص w-X و h-X                                ║[span_11](end_span)
 * [span_12](start_span)║  🔹 تكبير نص: زِد text-[Xpx]                                  ║[span_12](end_span)
 * [span_13](start_span)║  🔹 استدارة أكبر: rounded-3xl أو rounded-[30px]                ║[span_13](end_span)
 * [span_14](start_span)║  🔹 ظل أقوى: shadow-lg أو shadow-[0_4px_20px_rgba(0,0,0,0.1)] ║[span_14](end_span)
 * [span_15](start_span)║  🔹 ظل أخف: shadow-sm أو shadow-none                          ║[span_15](end_span)
 * ╚══════════════════════════════════════════════════════════════════╝
 */

[span_16](start_span)import React, { useState, useEffect, useCallback } from 'react';[span_16](end_span)
import {
  QrCode, Receipt, ListTodo, LayoutGrid,
  Languages, ChevronUp, Check, Vibrate
[span_17](start_span)} from 'lucide-react';[span_17](end_span)

[span_18](start_span)const MainScreen = () => {[span_18](end_span)
  [span_19](start_span)const [activeTab, setActiveTab] = useState('Accueil');[span_19](end_span)
  [span_20](start_span)const [isDiscreet, setIsDiscreet] = useState(true);[span_20](end_span)
  const [modalAction, setModalAction] = useState<'activate' | [span_21](start_span)'deactivate' | null>(null);[span_21](end_span)
  [span_22](start_span)const [toastMsg, setToastMsg] = useState('');[span_22](end_span)
  [span_23](start_span)const [showShakeTooltip, setShowShakeTooltip] = useState(true);[span_23](end_span)
  [span_24](start_span)const isLockedRef = React.useRef(false);[span_24](end_span)
  [span_25](start_span)const lastShakeRef = React.useRef({ x: 0, y: 0, z: 0, time: 0 });[span_25](end_span)

  [span_26](start_span)const showToast = useCallback((msg: string) => {[span_26](end_span)
    [span_27](start_span)setToastMsg(msg);[span_27](end_span)
    [span_28](start_span)setTimeout(() => setToastMsg(''), 3000);[span_28](end_span)
  }, []);

  [span_29](start_span)const handleToggleDiscreet = useCallback(() => {[span_29](end_span)
    [span_30](start_span)if (isLockedRef.current) return;[span_30](end_span)
    [span_31](start_span)setModalAction((prev) => {[span_31](end_span)
      [span_32](start_span)if (prev !== null) return prev;[span_32](end_span)
      return isDiscreet ? [span_33](start_span)'deactivate' : 'activate';[span_33](end_span)
    });
  }, [isDiscreet]);

  [span_34](start_span)const closeAndLock = () => {[span_34](end_span)
    [span_35](start_span)setModalAction(null);[span_35](end_span)
    [span_36](start_span)isLockedRef.current = true;[span_36](end_span)
    [span_37](start_span)setTimeout(() => {[span_37](end_span)
      [span_38](start_span)isLockedRef.current = false;[span_38](end_span)
      [span_39](start_span)lastShakeRef.current = { x: 0, y: 0, z: 0, time: 0 };[span_39](end_span)
    }, 1000);
  };

  [span_40](start_span)const confirmAction = () => {[span_40](end_span)
    [span_41](start_span)if (modalAction === 'deactivate') {[span_41](end_span)
      [span_42](start_span)setIsDiscreet(false);[span_42](end_span)
      [span_43](start_span)setShowShakeTooltip(false);[span_43](end_span)
      [span_44](start_span)showToast('Vous quittez le mode discret !');[span_44](end_span)
    [span_45](start_span)} else if (modalAction === 'activate') {[span_45](end_span)
      [span_46](start_span)setIsDiscreet(true);[span_46](end_span)
      [span_47](start_span)showToast('Vous passez en mode discret !');[span_47](end_span)
    }
    [span_48](start_span)closeAndLock();[span_48](end_span)
  };

  const cancelAction = () => { closeAndLock(); [span_49](start_span)};[span_49](end_span)

  [span_50](start_span)useEffect(() => {[span_50](end_span)
    [span_51](start_span)const threshold = 2500;[span_51](end_span)
    [span_52](start_span)const handleMotion = (e: DeviceMotionEvent) => {[span_52](end_span)
      [span_53](start_span)if (modalAction !== null || isLockedRef.current) return;[span_53](end_span)
      [span_54](start_span)const current = e.accelerationIncludingGravity;[span_54](end_span)
      [span_55](start_span)if (!current || current.x === null) return;[span_55](end_span)
      [span_56](start_span)const currentTime = new Date().getTime();[span_56](end_span)
      [span_57](start_span)const last = lastShakeRef.current;[span_57](end_span)
      [span_58](start_span)if (last.time === 0) {[span_58](end_span)
        last.x = current.x; last.y = current.y || 0; last.z = current.z || [span_59](start_span)0;[span_59](end_span)
        [span_60](start_span)last.time = currentTime; return;[span_60](end_span)
      }
      [span_61](start_span)const diffTime = currentTime - last.time;[span_61](end_span)
      [span_62](start_span)if (diffTime > 100) {[span_62](end_span)
        [span_63](start_span)const deltaX = current.x - last.x;[span_63](end_span)
        [span_64](start_span)const deltaY = (current.y || 0) - last.y;[span_64](end_span)
        [span_65](start_span)const deltaZ = (current.z || 0) - last.z;[span_65](end_span)
        [span_66](start_span)const speed = Math.abs(deltaX + deltaY + deltaZ) / diffTime * 10000;[span_66](end_span)
        [span_67](start_span)if (speed > threshold) {[span_67](end_span)
          [span_68](start_span)handleToggleDiscreet();[span_68](end_span)
          [span_69](start_span)isLockedRef.current = true;[span_69](end_span)
        }
        last.x = current.x; last.y = current.y || 0; last.z = current.z || [span_70](start_span)0;[span_70](end_span)
        [span_71](start_span)last.time = currentTime;[span_71](end_span)
      }
    };
    [span_72](start_span)window.addEventListener('devicemotion', handleMotion);[span_72](end_span)
    [span_73](start_span)return () => window.removeEventListener('devicemotion', handleMotion);[span_73](end_span)
  }, [handleToggleDiscreet, modalAction]);

  return (
    [span_74](start_span)<div className="w-full max-w-md mx-auto min-h-[100dvh] bg-[#f8f9fa] relative pb-20 font-sans animate-in fade-in duration-500 shadow-2xl">[span_74](end_span)

      {/* إشعارات */}
      [span_75](start_span)<div className="fixed top-10 left-0 right-0 z-50 flex flex-col items-center space-y-2 px-4 pointer-events-none">[span_75](end_span)
        [span_76](start_span){showShakeTooltip && isDiscreet && !toastMsg && ([span_76](end_span)
          [span_77](start_span)<div className="bg-white rounded-2xl p-4 shadow-lg flex items-center space-x-3 w-full max-w-[360px] animate-in slide-in-from-top-4 pointer-events-auto">[span_77](end_span)
            [span_78](start_span)<Vibrate className="w-6 h-6 text-gray-800" strokeWidth={1.5} />[span_78](end_span)
            [span_79](start_span)<span className="text-[13px] font-medium text-black">Secouez votre téléphone pour quitter le mode discret.</span>[span_79](end_span)
          </div>
        )}
        [span_80](start_span){toastMsg && ([span_80](end_span)
          [span_81](start_span)<div className="bg-white rounded-2xl p-4 shadow-lg flex items-center space-x-3 w-full max-w-[360px] animate-in slide-in-from-top-4 pointer-events-auto">[span_81](end_span)
            [span_82](start_span)<div className="w-6 h-6 rounded-full bg-[#84cc16] flex items-center justify-center">[span_82](end_span)
              [span_83](start_span)<Check className="w-4 h-4 text-white" strokeWidth={3} />[span_83](end_span)
            </div>
            [span_84](start_span)<span className="text-[14px] font-medium text-black">{toastMsg}</span>[span_84](end_span)
          </div>
        )}
      </div>

      {/* نافذة التأكيد */}
      [span_85](start_span){modalAction !== null && ([span_85](end_span)
        [span_86](start_span)<div className="fixed inset-0 z-[100] flex items-center justify-center px-6">[span_86](end_span)
          [span_87](start_span)<div className="absolute inset-0 bg-black/40 transition-opacity" onClick={cancelAction}></div>[span_87](end_span)
          [span_88](start_span)<div className="bg-white rounded-[24px] w-full max-w-[340px] p-6 relative z-10 animate-in zoom-in-95 shadow-2xl">[span_88](end_span)
            [span_89](start_span)<h3 className="text-[19px] font-medium text-black mb-3">Mode discret</h3>[span_89](end_span)
            [span_90](start_span)<p className="text-[15px] text-gray-700 leading-relaxed mb-8">[span_90](end_span)
              {modalAction === 'deactivate' ? "Souhaitez-vous quitter le mode discret ?" [span_91](start_span): "Souhaitez-vous activer le mode discret ?"}[span_91](end_span)
            </p>
            [span_92](start_span)<div className="flex justify-end space-x-6">[span_92](end_span)
              [span_93](start_span)<button onClick={cancelAction} className="text-[#00bfa5] font-semibold text-[14px] uppercase">Annuler</button>[span_93](end_span)
              <button onClick={confirmAction} className="text-[#00bfa5] font-semibold text-[14px] uppercase">{modalAction === 'deactivate' ? [span_94](start_span)'Désactiver' : 'Activer'}</button>[span_94](end_span)
            </div>
          </div>
        </div>
      )}

      {/* الـ QR Code المعدل (أكبر كما في الأصل) */}
      [span_95](start_span)<div className="pt-8 px-5 pb-4">[span_95](end_span)
        [span_96](start_span)<div className="inline-block p-1.5 border-[2px] border-[#00bfa5] rounded-xl bg-white shadow-sm">[span_96](end_span)
          [span_97](start_span)<QrCode className="w-11 h-11 text-black" strokeWidth={1.5} />[span_97](end_span)
        </div>
      </div>

      {/* بطاقة المستخدم - تعديل الخط والظل */}
      [span_98](start_span)<div className="px-5 mb-6">[span_98](end_span)
        [span_99](start_span)<div className="bg-white rounded-[22px] p-5 shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-gray-50 flex justify-between items-start">[span_99](end_span)
          [span_100](start_span)<div className="flex-1 pr-2">[span_100](end_span)
            [span_101](start_span)<h2 className="text-[17px] font-bold text-gray-900 leading-tight">Cheikh Sidiya Moubareckou</h2>[span_101](end_span)
            <p className="text-gray-500 text-[13px] mt-1 font-medium">{isDiscreet ? [span_102](start_span)'+222 ** ** ** **' : '+222 49 05 51 37'}</p>[span_102](end_span)
          </div>
          [span_103](start_span)<div className="text-right flex items-center pt-1 shrink-0">[span_103](end_span)
            <span className={`${isDiscreet ? 'text-[20px] text-gray-400' : 'text-[16px] text-gray-700'} font-bold`}>{isDiscreet ? [span_104](start_span)'****' : '100 000 005'}</span>[span_104](end_span)
            [span_105](start_span)<span className="text-gray-500 font-bold ml-1.5 text-[12px]">MRU</span>[span_105](end_span)
          </div>
        </div>
      </div>

      {/* شبكة الخدمات - المسافات والخطوط الدقيقة */}
      [span_106](start_span)<div className="px-5">[span_106](end_span)
        [span_107](start_span)<div className="grid grid-cols-2 gap-4">[span_107](end_span)
          {[
            [span_108](start_span){ label: "Transfert\nd'argent", img: "6lqgx7.jpg", color: "#10b981" },[span_108](end_span)
            [span_109](start_span){ label: "Paiement\nCommerçant", img: "96v1sg.jpg", color: "#38bdf8" },[span_109](end_span)
            [span_110](start_span){ label: "Paiement\nFactures", img: "ey4ss4.jpg", color: "#6366f1" },[span_110](end_span)
            [span_111](start_span){ label: "Recharge\ntéléphonique", img: "brlzo8.jpg", color: "#a855f7" },[span_111](end_span)
            [span_112](start_span){ label: "Recharge\ncompte", img: "s463xg.jpg", color: "#f87171" },[span_112](end_span)
            [span_113](start_span){ label: "Retrait d'argent", img: "id7b1o.jpg", color: "#fbbf24" }[span_113](end_span)
          ].map((item, idx) => (
            [span_114](start_span)<div key={idx} className="bg-white rounded-[20px] p-3 shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center space-x-3">[span_114](end_span)
              [span_115](start_span)<div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 overflow-hidden" style={{ backgroundColor: item.color }}>[span_115](end_span)
                [span_116](start_span)<img src={`https://files.catbox.moe/${item.img}`} className="w-full h-full object-cover" alt="" />[span_116](end_span)
              </div>
              [span_117](start_span)[span_118](start_span)<span className="text-[12.5px] font-bold text-gray-600 leading-[1.2] whitespace-pre-line">{item.label}</span>[span_117](end_span)[span_118](end_span)
            </div>
          ))}
        </div>
      </div>

      {/* قسم Autres */}
      [span_119](start_span)<div className="px-5 mt-6">[span_119](end_span)
        [span_120](start_span)<h3 className="text-gray-500 text-[13.5px] font-bold mb-3 px-1">Autres</h3>[span_120](end_span)
        [span_121](start_span)<div className="grid grid-cols-2 gap-4">[span_121](end_span)
          [span_122](start_span)<div className="bg-white rounded-[20px] p-3 shadow-sm border border-gray-100 flex items-center space-x-3">[span_122](end_span)
            [span_123](start_span)<div className="w-11 h-11 rounded-xl bg-[#f59e0b] overflow-hidden">[span_123](end_span)
              [span_124](start_span)<img src="https://files.catbox.moe/395dtl.jpg" className="w-full h-full object-cover" alt="" />[span_124](end_span)
            </div>
            [span_125](start_span)<span className="text-[12.5px] font-bold text-gray-600">Agences<br/>Masrvi</span>[span_125](end_span)
          </div>
          [span_126](start_span)<div className="bg-white/50 rounded-[20px] p-3 border border-gray-50 flex items-center space-x-3 opacity-60">[span_126](end_span)
            [span_127](start_span)<div className="w-11 h-11 rounded-xl bg-[#a7f3d0] flex items-center justify-center">[span_127](end_span)
              [span_128](start_span)<Receipt className="w-5 h-5 text-white" />[span_128](end_span)
            </div>
            [span_129](start_span)<span className="text-[12.5px] font-bold text-gray-400">Relevés de<br/>compte</span>[span_129](end_span)
          </div>
        </div>
      </div>

      {/* شريط التنقل السفلي الاحترافي */}
      [span_130](start_span)<div className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white border-t border-gray-100 flex justify-around items-center py-3 pb-safe z-50">[span_130](end_span)
        [span_131](start_span)<div className="flex flex-col items-center space-y-1 w-16 cursor-pointer" onClick={() => setActiveTab('Accueil')}>[span_131](end_span)
          <img src={activeTab === 'Accueil' ? [span_132](start_span)"https://files.catbox.moe/6uq1ht.jpg" : "https://files.catbox.moe/itum37.jpg"} className="w-6 h-6 object-contain" alt="" />[span_132](end_span)
          <span className={`text-[11px] ${activeTab === 'Accueil' ? [span_133](start_span)'font-bold text-[#00bfa5]' : 'font-medium text-gray-400'}`}>Accueil</span>[span_133](end_span)
        </div>
        [span_134](start_span)<div className="flex flex-col items-center space-y-1 w-16 cursor-pointer" onClick={() => setActiveTab('Produits')}>[span_134](end_span)
          <ListTodo className={`w-6 h-6 ${activeTab === 'Produits' ? [span_135](start_span)'text-[#00bfa5]' : 'text-gray-400'}`} />[span_135](end_span)
          <span className={`text-[11px] ${activeTab === 'Produits' ? [span_136](start_span)'font-bold text-[#00bfa5]' : 'font-medium text-gray-400'}`}>Produits</span>[span_136](end_span)
        </div>
        [span_137](start_span)<div className="flex flex-col items-center space-y-1 w-16 cursor-pointer" onClick={() => setActiveTab('Menu')}>[span_137](end_span)
          <LayoutGrid className={`w-6 h-6 ${activeTab === 'Menu' ? [span_138](start_span)'text-[#00bfa5]' : 'text-gray-400'}`} />[span_138](end_span)
          <span className={`text-[11px] ${activeTab === 'Menu' ? [span_139](start_span)'font-bold text-[#00bfa5]' : 'font-medium text-gray-400'}`}>Menu</span>[span_139](end_span)
        </div>
      </div>
    </div>
  );
};

[span_140](start_span)export default function App() {[span_140](end_span)
  [span_141](start_span)const [appState, setAppState] = useState('green');[span_141](end_span)

  [span_142](start_span)useEffect(() => {[span_142](end_span)
    [span_143](start_span)if (appState === 'green') {[span_143](end_span)
      [span_144](start_span)const timer = setTimeout(() => setAppState('white'), 2000);[span_144](end_span)
      [span_145](start_span)return () => clearTimeout(timer);[span_145](end_span)
    }
    [span_146](start_span)if (appState === 'white') {[span_146](end_span)
      [span_147](start_span)const timer = setTimeout(() => setAppState('login'), 2500);[span_147](end_span)
      [span_148](start_span)return () => clearTimeout(timer);[span_148](end_span)
    }
  }, [appState]);

  [span_149](start_span)if (appState === 'green') {[span_149](end_span)
    return (
      [span_150](start_span)<div className="w-full max-w-md mx-auto h-[100dvh] flex flex-col items-center justify-center relative bg-[#00dca0] animate-in fade-in duration-300 shadow-2xl">[span_150](end_span)
        [span_151](start_span)<img src="https://files.catbox.moe/jd1pg1.jpg" alt="Logo" className="w-64 object-contain" />[span_151](end_span)
      </div>
    );
  }

  [span_152](start_span)if (appState === 'white') {[span_152](end_span)
    return (
      [span_153](start_span)<div className="w-full max-w-md mx-auto h-[100dvh] bg-white flex flex-col items-center justify-center relative animate-in fade-in duration-300 shadow-2xl">[span_153](end_span)
        [span_154](start_span)<img src="https://files.catbox.moe/pv561j.jpg" alt="Logo" className="w-64 object-contain mb-12" />[span_154](end_span)
        [span_155](start_span)<div className="w-8 h-8 border-[3px] border-[#00dca0] border-t-transparent rounded-full animate-spin"></div>[span_155](end_span)
      </div>
    );
  }

  [span_156](start_span)if (appState === 'login') {[span_156](end_span)
    return (
      [span_157](start_span)<div className="w-full max-w-md mx-auto h-[100dvh] bg-white flex flex-col relative font-sans animate-in fade-in duration-500 shadow-2xl">[span_157](end_span)
        [span_158](start_span)<div className="absolute top-6 right-6 flex flex-col items-center text-[#00dca0] cursor-pointer">[span_158](end_span)
          [span_159](start_span)<Languages className="w-7 h-7 mb-0.5" strokeWidth={1.5} />[span_159](end_span)
          [span_160](start_span)<span className="text-[11px] font-medium">Langue</span>[span_160](end_span)
        </div>
        [span_161](start_span)<div className="flex-1 flex items-center justify-center pb-10">[span_161](end_span)
          [span_162](start_span)<img src="https://files.catbox.moe/pv561j.jpg" alt="Logo" className="w-64 object-contain" />[span_162](end_span)
        </div>
        [span_163](start_span)<div className="w-full bg-[#00dca0] rounded-t-[32px] px-6 py-8 flex flex-col items-center shadow-lg relative overflow-hidden">[span_163](end_span)
          [span_164](start_span)<div className="relative z-10 flex flex-col items-center w-full">[span_164](end_span)
            [span_165](start_span)<p className="text-white text-center text-[17px] font-bold mb-8 leading-snug">Bienvenue Cheikh Sidiya Moubareckou Elhousseine !</p>[span_165](end_span)
            [span_166](start_span)<button onClick={() => setAppState('main')} className="w-full bg-white text-black font-bold py-4 rounded-xl mb-4 shadow-sm active:scale-[0.98] transition-all">Connexion</button>[span_166](end_span)
            [span_167](start_span)<button className="w-full bg-white/20 text-white font-bold py-4 rounded-xl mb-8 border border-white/30">Supprimer le profil</button>[span_167](end_span)
            [span_168](start_span)<div className="flex flex-col items-center text-white mt-2 cursor-pointer opacity-90">[span_168](end_span)
              [span_169](start_span)<ChevronUp className="w-5 h-5 mb-0.5" strokeWidth={2.5} />[span_169](end_span)
              [span_170](start_span)<span className="text-[13px] font-medium tracking-wide">Contact et informations</span>[span_170](end_span)
            </div>
          </div>
        </div>
      </div>
    );
  }

  [span_171](start_span)return <MainScreen />;[span_171](end_span)
}
