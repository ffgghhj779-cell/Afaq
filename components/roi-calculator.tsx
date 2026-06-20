'use client';

import { useState, useMemo } from 'react';
import { TrendingUp, Clock, Wallet } from "lucide-react";
import { useLanguage } from './language-provider';

export function RoiCalculator() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState(5000);
  const [supportCost, setSupportCost] = useState(25000);

  const { savedHours, savedCost, revenueIncrease } = useMemo(() => ({
    savedHours: Math.floor(orders * 0.15),
    savedCost: Math.floor(supportCost * 0.65),
    revenueIncrease: Math.floor(orders * 150 * 0.12),
  }), [orders, supportCost]);

  return (
    <section className="py-24 px-6 lg:px-[60px] border-t border-white/5 relative z-10">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <div className="small-caps-primary mb-4 mx-auto text-[#165DFF]">{t('العائد على الاستثمار', 'RETURN ON INVESTMENT')}</div>
          <h2 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl tracking-tight">{t('احسب قيمة تبنيك للذكاء الاصطناعي', 'Calculate the Value of AI Adoption')}</h2>
          <p className="text-[#aaaaaa] mt-4 max-w-2xl mx-auto font-light leading-relaxed">
            {t('استخدم حاسبة العائد التفاعلية لتقدير التوفير المالي والزيادة المتوقعة في الإيرادات شهرياً عند استخدام منظومة AFAQ.', 'Use the interactive ROI calculator to estimate monthly financial savings and projected revenue growth when using the AFAQ ecosystem.')}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          <div className="flex-1 glass-panel p-8 md:p-12 w-full rounded-sm">
            <div className="space-y-10">
              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="text-lg text-white font-medium">{t('الطلبات الشهرية', 'Monthly Orders')}</label>
                  <span className="text-2xl font-light text-[#165DFF]">{orders.toLocaleString()} {t('طلب', 'orders')}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="50000"
                  step="500"
                  value={orders}
                  onChange={(e) => setOrders(Number(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-full appearance-none outline-none accent-[#165DFF]"
                />
              </div>

              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="text-lg text-white font-medium">{t('تكلفة الدعم الفني الحالية', 'Current Support Cost')}</label>
                  <span className="text-2xl font-light text-[#165DFF]">{supportCost.toLocaleString()} {t('ر.س', 'SAR')}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="150000"
                  step="5000"
                  value={supportCost}
                  onChange={(e) => setSupportCost(Number(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-full appearance-none outline-none accent-[#165DFF]"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="glass-dark p-8 rtl:border-r-4 ltr:border-l-4 rtl:border-r-[#165DFF] ltr:border-l-[#165DFF] border-none flex flex-col items-start relative overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
              <div className="absolute top-0 rtl:left-0 ltr:right-0 p-4 opacity-10"><Wallet className="w-24 h-24 text-[#165DFF]" /></div>
              <div className="small-caps mb-3">{t('التوفير الشهري المقدر', 'Est. Monthly Savings')}</div>
              <div className="text-4xl md:text-5xl font-light text-white mb-2">{savedCost.toLocaleString()}</div>
              <div className="text-[#888] font-light">{t('ريال سعودي', 'SAR')}</div>
            </div>

            <div className="glass-dark p-8 rtl:border-r-4 ltr:border-l-4 rtl:border-r-[#165DFF] ltr:border-l-[#165DFF] border-none flex flex-col items-start relative overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
              <div className="absolute top-0 rtl:left-0 ltr:right-0 p-4 opacity-10"><TrendingUp className="w-24 h-24 text-[#165DFF]" /></div>
              <div className="small-caps mb-3">{t('نمو الإيرادات المتوقع', 'Projected Revenue Growth')}</div>
              <div className="text-4xl md:text-5xl font-light text-white mb-2">+{revenueIncrease.toLocaleString()}</div>
              <div className="text-[#888] font-light">{t('ريال سعودي', 'SAR')}</div>
            </div>

            <div className="glass-dark p-8 md:col-span-2 rtl:border-r-4 ltr:border-l-4 rtl:border-r-white/20 ltr:border-l-white/20 border-none flex flex-col items-start relative overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
              <div className="absolute top-0 rtl:left-0 ltr:right-0 p-4 opacity-10"><Clock className="w-32 h-32 text-white" /></div>
              <div className="small-caps mb-3">{t('وقت الإدارة الموفر', 'Management Time Saved')}</div>
              <div className="text-4xl md:text-5xl font-light text-white mb-2">{savedHours.toLocaleString()}</div>
              <div className="text-[#888] font-light">{t('ساعة عمل / شهر', 'business hours / month')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
