import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type LanguageCode = 'en' | 'es' | 'zh' | 'vi' | 'tl' | 'ko';
export type TextSize = 'normal' | 'large' | 'xlarge';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  flag: string;
  speechLocale: string;
  seniorGreeting: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    label: 'English',
    nativeLabel: 'English (US)',
    flag: '🇺🇸',
    speechLocale: 'en-US',
    seniorGreeting: 'Senior Healthcare & Rx Savings'
  },
  {
    code: 'es',
    label: 'Spanish',
    nativeLabel: 'Español',
    flag: '🇪🇸',
    speechLocale: 'es-US',
    seniorGreeting: 'Ahorros en Medicamentos para Adultos Mayores'
  },
  {
    code: 'zh',
    label: 'Chinese',
    nativeLabel: '简体中文',
    flag: '🇨🇳',
    speechLocale: 'zh-CN',
    seniorGreeting: '长者长辈处方药省钱指南与无障碍服务'
  },
  {
    code: 'vi',
    label: 'Vietnamese',
    nativeLabel: 'Tiếng Việt',
    flag: '🇻🇳',
    speechLocale: 'vi-VN',
    seniorGreeting: 'Hỗ Trợ Tiết Kiệm Thuốc Cho Người Cao Tuổi'
  },
  {
    code: 'tl',
    label: 'Tagalog',
    nativeLabel: 'Tagalog (Filipino)',
    flag: '🇵🇭',
    speechLocale: 'fil-PH',
    seniorGreeting: 'Tulong sa Gamot para sa mga Senior Citizen'
  },
  {
    code: 'ko',
    label: 'Korean',
    nativeLabel: '한국어',
    flag: '🇰🇷',
    speechLocale: 'ko-KR',
    seniorGreeting: '어르신 시니어 처방약 할인 및 복약 안내'
  }
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Brand & Navigation
    'brand.name': 'PharmaCompare',
    'brand.tagline': 'Algorithmic Rx Clearinghouse & Senior Care',
    'nav.screens': 'Explore All 13 Screens',
    'nav.screensShort': 'Screens',
    'nav.rxSearch': 'Rx Search',
    'nav.routingAi': 'Routing AI',
    'nav.rxPass': 'Rx Pass Card',
    'nav.teleconsult': 'Teleconsult MD',
    'nav.consumerMode': 'Consumer Mode',
    'nav.enterpriseMode': 'Enterprise OS',
    'nav.seniorMode': 'Senior Mode',
    'nav.seniorAssist': 'Senior Assistance',
    'nav.location': 'SF Bay Area, CA',

    // Senior Accessibility Bar
    'senior.bannerTitle': 'Senior Citizen & Medicare Assistance Hub',
    'senior.bannerSubtitle': 'Large text, voice pronunciation, Medicare Part D tips, and 24/7 pharmacist assistance.',
    'senior.textSize': 'Text Size',
    'senior.normalText': 'Standard',
    'senior.largeText': 'Large (115%)',
    'senior.xlargeText': 'Extra Large (130%)',
    'senior.voiceReader': 'Read Aloud',
    'senior.voiceActive': 'Reading Aloud...',
    'senior.voiceStop': 'Stop Reading',
    'senior.hotline': 'Senior Helpline: 1-800-MEDICARE',
    'senior.pharmacistCall': 'Speak to a Pharmacist',
    'senior.howItWorks': 'Senior Guide',
    'senior.medicareNote': 'Works with Medicare Part D, Medicare Advantage, or as cash discount when deductible is high.',

    // Search & Drug Catalog
    'search.badge': 'Real-Time Multi-Pharmacy Clearinghouse',
    'search.title': 'Compare prescription prices across',
    'search.pharmacyCount': '68,000+ pharmacies',
    'search.subtitle': 'Direct wholesale prices, unadvertised manufacturer discount cards, and Medicare-friendly split-prescription routing.',
    'search.placeholder': 'Search by medication name (e.g., Atorvastatin, Ozempic, Metformin, Lisinopril, Eliquis)...',
    'search.btn': 'Find Savings',
    'search.trending': 'Trending for Seniors:',
    'search.filter': 'Filter:',
    'search.allMeds': 'All Medications',
    'search.genericOnly': 'Generic Alternatives',
    'search.fastPickup': 'Ready in 15 Min',
    'search.mailOrder': 'Free Mail Delivery',
    'search.classLabel': 'Therapeutic Class:',
    'search.allClasses': 'All Classes',
    'search.showing': 'Showing',
    'search.matchingMeds': 'matching medications',
    'search.pricesCalibrated': 'Prices calibrated to:',
    'search.optimizeCart': 'Optimize Multi-Rx Cart',

    // Drug Card
    'card.lowestCash': 'Lowest Cash Price',
    'card.save': 'Save',
    'card.genericAvailable': 'Generic Available',
    'card.brandExclusive': 'Brand Exclusive',
    'card.genericFor': 'Generic for',
    'card.standard': 'Standard:',
    'card.form': 'Form:',
    'card.qty': 'Qty:',
    'card.at': 'at',
    'card.configure': 'Configure Dose & Compare',
    'card.digitalPass': 'Digital Pass',
    'card.splitRoute': 'Split Route',
    'card.listen': 'Listen to prescription details',
    'card.audioDescription': 'Prescription',

    // Stock Status
    'stock.ready15': 'Ready in 15 min',
    'stock.inStock': 'In Stock',
    'stock.mailOrder': 'Free 2-Day Mail',
    'stock.specialOrder': 'Special Order',

    // Senior Modal
    'modal.seniorGuideTitle': 'Senior Prescription Savings & Medicare Guide',
    'modal.seniorTip1Title': '1. When Cash Price Beats Medicare Part D Copays',
    'modal.seniorTip1Desc': 'Many generic maintenance medications (like Atorvastatin, Metformin, Lisinopril) cost as low as $8-$12 in cash with our discount card—often cheaper than your insurance deductible or coverage gap (donut hole)!',
    'modal.seniorTip2Title': '2. Free Home Delivery for Cold-Chain & Chronic Meds',
    'modal.seniorTip2Desc': 'No need to drive to the pharmacy. Order 90-day supplies shipped with temperature verification straight to your doorstep at no extra cost.',
    'modal.seniorTip3Title': '3. Show the Digital Pass to Any Cashier',
    'modal.seniorTip3Desc': 'Simply show your phone screen with the BIN, PCN, and Group numbers. The pharmacy technician enters it just like secondary insurance.',
    'modal.close': 'Close Guide',
    'modal.callPharmacist': 'Call Senior Support (1-800-633-4227)'
  },

  es: {
    // Brand & Navigation
    'brand.name': 'PharmaCompare',
    'brand.tagline': 'Cámara de Compensación de Recetas y Cuidado de Adultos Mayores',
    'nav.screens': 'Explorar las 13 Pantallas',
    'nav.screensShort': 'Pantallas',
    'nav.rxSearch': 'Buscar Medicamentos',
    'nav.routingAi': 'Enrutador IA',
    'nav.rxPass': 'Pase de Descuento Rx',
    'nav.teleconsult': 'Teleconsulta Médica',
    'nav.consumerMode': 'Modo Paciente',
    'nav.enterpriseMode': 'Modo Farmacia',
    'nav.seniorMode': 'Modo Adulto Mayor',
    'nav.seniorAssist': 'Ayuda para Mayores',
    'nav.location': 'Área de la Bahía, CA',

    // Senior Accessibility Bar
    'senior.bannerTitle': 'Centro de Ayuda para Adultos Mayores y Medicare',
    'senior.bannerSubtitle': 'Letra grande, lectura en voz alta, consejos de Medicare Parte D y farmacéuticos disponibles 24/7.',
    'senior.textSize': 'Tamaño de Letra',
    'senior.normalText': 'Estándar',
    'senior.largeText': 'Grande (115%)',
    'senior.xlargeText': 'Muy Grande (130%)',
    'senior.voiceReader': 'Leer en Voz Alta',
    'senior.voiceActive': 'Leyendo en voz alta...',
    'senior.voiceStop': 'Detener Voz',
    'senior.hotline': 'Línea para Mayores: 1-800-MEDICARE',
    'senior.pharmacistCall': 'Hablar con Farmacéutico',
    'senior.howItWorks': 'Guía para Mayores',
    'senior.medicareNote': 'Funciona con Medicare Parte D, Medicare Advantage o como descuento en efectivo.',

    // Search & Drug Catalog
    'search.badge': 'Comparador de Farmacias en Tiempo Real',
    'search.title': 'Compare precios de recetas en más de',
    'search.pharmacyCount': '68,000 farmacias',
    'search.subtitle': 'Precios mayoristas directos, tarjetas de descuento de fabricantes y rutas inteligentes para recetas.',
    'search.placeholder': 'Buscar por nombre del medicamento (ej. Atorvastatina, Ozempic, Metformina, Lisinopril)...',
    'search.btn': 'Buscar Ahorros',
    'search.trending': 'Comunes en adultos mayores:',
    'search.filter': 'Filtrar:',
    'search.allMeds': 'Todos los Medicamentos',
    'search.genericOnly': 'Alternativas Genéricas',
    'search.fastPickup': 'Listo en 15 Minutos',
    'search.mailOrder': 'Envío a Domicilio Gratis',
    'search.classLabel': 'Clase Terapéutica:',
    'search.allClasses': 'Todas las Clases',
    'search.showing': 'Mostrando',
    'search.matchingMeds': 'medicamentos encontrados',
    'search.pricesCalibrated': 'Precios para el código postal:',
    'search.optimizeCart': 'Optimizar Recetas',

    // Drug Card
    'card.lowestCash': 'Precio Más Bajo en Efectivo',
    'card.save': 'Ahorre',
    'card.genericAvailable': 'Genérico Disponible',
    'card.brandExclusive': 'Marca Exclusiva',
    'card.genericFor': 'Genérico de',
    'card.standard': 'Dosis habitual:',
    'card.form': 'Presentación:',
    'card.qty': 'Cantidad:',
    'card.at': 'en',
    'card.configure': 'Configurar Dosis y Comparar',
    'card.digitalPass': 'Pase Digital',
    'card.splitRoute': 'Dividir Pedido',
    'card.listen': 'Escuchar información del medicamento',
    'card.audioDescription': 'Medicamento',

    // Stock Status
    'stock.ready15': 'Listo en 15 min',
    'stock.inStock': 'Disponible',
    'stock.mailOrder': 'Envío Gratis en 2 Días',
    'stock.specialOrder': 'Pedido Especial',

    // Senior Modal
    'modal.seniorGuideTitle': 'Guía de Ahorro en Recetas para Adultos Mayores y Medicare',
    'modal.seniorTip1Title': '1. Cuando el precio en efectivo supera al copago de Medicare',
    'modal.seniorTip1Desc': 'Muchos medicamentos diarios (como Atorvastatina o Metformina) cuestan solo $8 a $12 en efectivo con nuestra tarjeta de descuento, ¡a menudo más barato que su deducible de seguro!',
    'modal.seniorTip2Title': '2. Envío a Domicilio Gratuito',
    'modal.seniorTip2Desc': 'Evite traslados a la farmacia. Solicite suministros para 90 días con entrega refrigerada y segura en su puerta sin costo adicional.',
    'modal.seniorTip3Title': '3. Muestre el Pase Digital al Farmacéutico',
    'modal.seniorTip3Desc': 'Simplemente muestre los números BIN, PCN y Grupo en la pantalla de su teléfono al cajero o técnico de farmacia.',
    'modal.close': 'Cerrar Guía',
    'modal.callPharmacist': 'Llamar a Asistencia (1-800-633-4227)'
  },

  zh: {
    // Brand & Navigation
    'brand.name': 'PharmaCompare 药价通',
    'brand.tagline': '长者处方药比价与医疗健保省钱清算所',
    'nav.screens': '浏览全部 13 个功能页面',
    'nav.screensShort': '功能目录',
    'nav.rxSearch': '查药省钱',
    'nav.routingAi': '智能比价',
    'nav.rxPass': '数字优惠卡',
    'nav.teleconsult': '远程名医',
    'nav.consumerMode': '患者模式',
    'nav.enterpriseMode': '药房管理',
    'nav.seniorMode': '长者关怀模式',
    'nav.seniorAssist': '长者无障碍服务',
    'nav.location': '加州旧金山湾区',

    // Senior Accessibility Bar
    'senior.bannerTitle': '长者及红蓝卡 Medicare 专属无障碍省钱中心',
    'senior.bannerSubtitle': '特大清晰字号、处方语音朗读、联邦红蓝卡 D 部分省钱指南及 24 小时药剂师热线。',
    'senior.textSize': '字体大小',
    'senior.normalText': '标准',
    'senior.largeText': '大字 (115%)',
    'senior.xlargeText': '特大字 (130%)',
    'senior.voiceReader': '语音朗读',
    'senior.voiceActive': '正在朗读...',
    'senior.voiceStop': '停止朗读',
    'senior.hotline': '长者联邦医保热线: 1-800-MEDICARE',
    'senior.pharmacistCall': '致电药剂师咨询',
    'senior.howItWorks': '长者省钱指南',
    'senior.medicareNote': '适用于 Medicare Part D、Medicare Advantage 或在自负额阶段直接按现金优惠结算。',

    // Search & Drug Catalog
    'search.badge': '全美实时连锁及独立药房比价',
    'search.title': '即时对比处方药价格，覆盖',
    'search.pharmacyCount': '68,000+ 家药房',
    'search.subtitle': '直连厂家批发底价、药厂未公开优惠卡及长者智能拆分邮寄送药。',
    'search.placeholder': '输入药品英文或通用名（如 Atorvastatin 降脂药、Metformin 降糖药、Ozempic、Lisinopril 降压药）...',
    'search.btn': '查询优惠',
    'search.trending': '长者常备药推荐：',
    'search.filter': '分类筛选：',
    'search.allMeds': '全部药品',
    'search.genericOnly': '普拿疼/仿制药平价替代',
    'search.fastPickup': '15分钟就近取药',
    'search.mailOrder': '免费温控冷链包邮到家',
    'search.classLabel': '疾病用药分类：',
    'search.allClasses': '全部病症分类',
    'search.showing': '正在显示',
    'search.matchingMeds': '种符合条件的药品',
    'search.pricesCalibrated': '价格参考邮编：',
    'search.optimizeCart': '多药混合智能拆单',

    // Drug Card
    'card.lowestCash': '最低自费现金特惠价',
    'card.save': '直降立省',
    'card.genericAvailable': '有平价通用名药',
    'card.brandExclusive': '原研专利品牌药',
    'card.genericFor': '原研药为',
    'card.standard': '常用规格：',
    'card.form': '剂型：',
    'card.qty': '盒装数量：',
    'card.at': '位于',
    'card.configure': '选定剂量与药房比价',
    'card.digitalPass': '出示优惠卡',
    'card.splitRoute': '拆分配送',
    'card.listen': '语音朗读药品与价格信息',
    'card.audioDescription': '处方药',

    // Stock Status
    'stock.ready15': '15分钟立等可取',
    'stock.inStock': '现货充足',
    'stock.mailOrder': '免费2日送达',
    'stock.specialOrder': '需提前1天调货',

    // Senior Modal
    'modal.seniorGuideTitle': '长者处方药省钱指南与红蓝卡（Medicare）说明',
    'modal.seniorTip1Title': '一、现金折后价往往低于保险自付额（Copay）',
    'modal.seniorTip1Desc': '像阿托伐他汀（Atorvastatin）和二甲双胍（Metformin）这类常用慢病药，使用我们的优惠卡现金自费仅需 $8 至 $12 美元，往往比红蓝卡 D 部分的自付门槛还划算！',
    'modal.seniorTip2Title': '二、90天慢病药温控冷链免费包邮直达家门',
    'modal.seniorTip2Desc': '长者免去冒雨雪前往药房的奔波劳顿。系统支持 90 天长期用药一键邮寄，全程带温度传感器保障药效安全。',
    'modal.seniorTip3Title': '三、取药时直接向柜台出示手机上的数字优惠卡',
    'modal.seniorTip3Desc': '只需向药房员工出示数字卡上的 BIN、PCN 和 Group 编号，药师直接扫描，无需繁琐表格即可直接抵扣。',
    'modal.close': '关闭指南',
    'modal.callPharmacist': '拨打长者关怀专线 (1-800-633-4227)'
  },

  vi: {
    // Brand & Navigation
    'brand.name': 'PharmaCompare',
    'brand.tagline': 'Hệ Thống Tiết Kiệm Đơn Thuốc Dành Cho Người Cao Tuổi',
    'nav.screens': 'Khám Phá Tất Cả 13 Màn Hình',
    'nav.screensShort': 'Màn Hình',
    'nav.rxSearch': 'Tìm Thuốc',
    'nav.routingAi': 'Lộ Trình AI',
    'nav.rxPass': 'Thẻ Giảm Giá Rx',
    'nav.teleconsult': 'Bác Sĩ Trực Tuyến',
    'nav.consumerMode': 'Chế Độ Bệnh Nhân',
    'nav.enterpriseMode': 'Quản Trị Nhà Thuốc',
    'nav.seniorMode': 'Chế Độ Cao Niên',
    'nav.seniorAssist': 'Hỗ Trợ Người Cao Tuổi',
    'nav.location': 'Vùng Vịnh SF, CA',

    // Senior Accessibility Bar
    'senior.bannerTitle': 'Trung Tâm Hỗ Trợ Người Cao Niên & Medicare',
    'senior.bannerSubtitle': 'Chữ lớn dễ đọc, đọc to bằng giọng nói, hướng dẫn Medicare Phần D và dược sĩ trợ giúp 24/7.',
    'senior.textSize': 'Cỡ Chữ',
    'senior.normalText': 'Tiêu Chuẩn',
    'senior.largeText': 'Lớn (115%)',
    'senior.xlargeText': 'Rất Lớn (130%)',
    'senior.voiceReader': 'Đọc To',
    'senior.voiceActive': 'Đang đọc...',
    'senior.voiceStop': 'Dừng Đọc',
    'senior.hotline': 'Đường Dây Nóng Cao Niên: 1-800-MEDICARE',
    'senior.pharmacistCall': 'Nói Chuyện Với Dược Sĩ',
    'senior.howItWorks': 'Hướng Dẫn Cao Niên',
    'senior.medicareNote': 'Áp dụng tốt với Medicare Phần D, Medicare Advantage hoặc trả tiền mặt khi mức khấu trừ cao.',

    // Search & Drug Catalog
    'search.badge': 'So Sánh Giá Thuốc Trực Tiếp',
    'search.title': 'So sánh giá đơn thuốc tại hơn',
    'search.pharmacyCount': '68.000 nhà thuốc',
    'search.subtitle': 'Giá bán buôn trực tiếp, thẻ giảm giá từ nhà sản xuất và giao thuốc tận nhà an toàn.',
    'search.placeholder': 'Tìm theo tên thuốc (ví dụ: Atorvastatin, Ozempic, Metformin, Lisinopril)...',
    'search.btn': 'Tìm Tiết Kiệm',
    'search.trending': 'Thuốc thông dụng cho người cao tuổi:',
    'search.filter': 'Lọc Theo:',
    'search.allMeds': 'Tất Cả Thuốc',
    'search.genericOnly': 'Thuốc Tương Đương (Generic)',
    'search.fastPickup': 'Nhận Thuốc Sau 15 Phút',
    'search.mailOrder': 'Giao Tận Nhà Miễn Phí',
    'search.classLabel': 'Nhóm Trị Liệu:',
    'search.allClasses': 'Tất Cả Các Nhóm',
    'search.showing': 'Đang hiển thị',
    'search.matchingMeds': 'loại thuốc phù hợp',
    'search.pricesCalibrated': 'Giá áp dụng cho mã bưu chính:',
    'search.optimizeCart': 'Tối Ưu Nhiều Đơn Thuốc',

    // Drug Card
    'card.lowestCash': 'Giá Tiền Mặt Thấp Nhất',
    'card.save': 'Tiết kiệm',
    'card.genericAvailable': 'Có Thuốc Tương Đương',
    'card.brandExclusive': 'Thuốc Biệt Dược Gốc',
    'card.genericFor': 'Tương đương với',
    'card.standard': 'Liều lượng thông thường:',
    'card.form': 'Dạng thuốc:',
    'card.qty': 'Số lượng:',
    'card.at': 'tại',
    'card.configure': 'Chọn Liều & So Sánh Giá',
    'card.digitalPass': 'Thẻ Kỹ Thuật Số',
    'card.splitRoute': 'Tách Đơn Hàng',
    'card.listen': 'Nghe thông tin chi tiết về thuốc',
    'card.audioDescription': 'Đơn thuốc',

    // Stock Status
    'stock.ready15': 'Sẵn sàng trong 15 phút',
    'stock.inStock': 'Còn hàng',
    'stock.mailOrder': 'Giao thư miễn phí 2 ngày',
    'stock.specialOrder': 'Đặt hàng đặc biệt',

    // Senior Modal
    'modal.seniorGuideTitle': 'Hướng Dẫn Tiết Kiệm Thuốc Cho Người Cao Tuổi & Medicare',
    'modal.seniorTip1Title': '1. Khi giá tiền mặt rẻ hơn mức đồng chi trả Medicare',
    'modal.seniorTip1Desc': 'Nhiều loại thuốc dùng hàng ngày (như Atorvastatin, Metformin) chỉ có giá từ $8 đến $12 khi dùng thẻ giảm giá của chúng tôi—rẻ hơn nhiều so với mức khấu trừ của bảo hiểm!',
    'modal.seniorTip2Title': '2. Giao Hàng Tận Nhà Miễn Phí Thuốc 90 Ngày',
    'modal.seniorTip2Desc': 'Quý vị không cần lái xe đến nhà thuốc. Đơn thuốc 90 ngày được đóng gói bảo quản nhiệt độ và giao tận cửa nhà hoàn toàn miễn phí.',
    'modal.seniorTip3Title': '3. Xuất Trình Thẻ Trên Điện Thoại Cho Dược Sĩ',
    'modal.seniorTip3Desc': 'Chỉ cần đưa màn hình điện thoại có số BIN, PCN và Group cho nhân viên nhà thuốc để được giảm giá ngay lập tức.',
    'modal.close': 'Đóng Hướng Dẫn',
    'modal.callPharmacist': 'Gọi Hỗ Trợ Người Cao Tuổi (1-800-633-4227)'
  },

  tl: {
    // Brand & Navigation
    'brand.name': 'PharmaCompare',
    'brand.tagline': 'Sentro ng Murang Gamot para sa mga Nakatatanda',
    'nav.screens': 'Tingnan ang Lahat ng 13 Screen',
    'nav.screensShort': 'Mga Pahina',
    'nav.rxSearch': 'Maghanap ng Gamot',
    'nav.routingAi': 'AI sa Pagtitipid',
    'nav.rxPass': 'Discount Pass sa Gamot',
    'nav.teleconsult': 'Konsulta sa Doktor',
    'nav.consumerMode': 'Moda ng Pasyente',
    'nav.enterpriseMode': 'Moda ng Parmasya',
    'nav.seniorMode': 'Moda ng Senior Citizen',
    'nav.seniorAssist': 'Tulong sa Senior',
    'nav.location': 'SF Bay Area, CA',

    // Senior Accessibility Bar
    'senior.bannerTitle': 'Sentro ng Tulong para sa mga Senior Citizen at Medicare',
    'senior.bannerSubtitle': 'Malalaking letra, boses na nagbabasa, gabay sa Medicare Part D, at tulong mula sa parmasyutiko 24/7.',
    'senior.textSize': 'Laki ng Titik',
    'senior.normalText': 'Karaniwan',
    'senior.largeText': 'Malaki (115%)',
    'senior.xlargeText': 'Napakalaki (130%)',
    'senior.voiceReader': 'Ipabasa nang Malakas',
    'senior.voiceActive': 'Binabasa ngayon...',
    'senior.voiceStop': 'Ihinto ang Boses',
    'senior.hotline': 'Hotline para sa Senior: 1-800-MEDICARE',
    'senior.pharmacistCall': 'Makipag-usap sa Parmasyutiko',
    'senior.howItWorks': 'Gabay sa Senior',
    'senior.medicareNote': 'Gumagana sa Medicare Part D, Medicare Advantage o bilang cash discount kapag mataas ang deductible.',

    // Search & Drug Catalog
    'search.badge': 'Paghahambing ng Presyo sa Parmasya',
    'search.title': 'Ihambing ang presyo ng reseta sa mahigit',
    'search.pharmacyCount': '68,000+ parmasya',
    'search.subtitle': 'Direktang presyong pakyawan, lihim na discount card mula sa gumagawa, at mabilis na pagpapadala.',
    'search.placeholder': 'Maghanap gamit ang pangalan ng gamot (hal. Atorvastatin, Ozempic, Metformin, Lisinopril)...',
    'search.btn': 'Maghanap ng Tipid',
    'search.trending': 'Madalas hanapin ng mga senior:',
    'search.filter': 'Salain Ayon Sa:',
    'search.allMeds': 'Lahat ng Gamot',
    'search.genericOnly': 'Generic na Alternatibo',
    'search.fastPickup': 'Handa sa Loob ng 15 Minuto',
    'search.mailOrder': 'Libreng Hatid sa Bahay',
    'search.classLabel': 'Uri ng Gamot:',
    'search.allClasses': 'Lahat ng Uri',
    'search.showing': 'Ipinapakita ang',
    'search.matchingMeds': 'mga tugmang gamot',
    'search.pricesCalibrated': 'Presyo para sa zip code:',
    'search.optimizeCart': 'I-optimize ang Maraming Reseta',

    // Drug Card
    'card.lowestCash': 'Pinakamababang Presyo sa Cash',
    'card.save': 'Makatipid ng',
    'card.genericAvailable': 'May Generic na Mabibili',
    'card.brandExclusive': 'Orihinal na Brand Lamang',
    'card.genericFor': 'Generic para sa',
    'card.standard': 'Karaniwang dosis:',
    'card.form': 'Anyo ng gamot:',
    'card.qty': 'Bilang:',
    'card.at': 'sa',
    'card.configure': 'Pumili ng Dosis at Ihambing',
    'card.digitalPass': 'Digital Pass',
    'card.splitRoute': 'Hatiin ang Bilihin',
    'card.listen': 'Pakinggan ang detalye ng gamot',
    'card.audioDescription': 'Reseta ng gamot',

    // Stock Status
    'stock.ready15': 'Handa sa 15 min',
    'stock.inStock': 'May Stock',
    'stock.mailOrder': 'Libreng 2-Araw na Hatid',
    'stock.specialOrder': 'Espesyal na Order',

    // Senior Modal
    'modal.seniorGuideTitle': 'Gabay sa Pagtitipid ng Gamot para sa mga Senior Citizen at Medicare',
    'modal.seniorTip1Title': '1. Kapag Mas Mura ang Cash Kaysa sa Copay ng Medicare',
    'modal.seniorTip1Desc': 'Maraming gamot sa maintenance (tulad ng Atorvastatin o Metformin) ay nagkakahalaga lamang ng $8 hanggang $12 sa cash gamit ang card—madalas mas mura kaysa sa deductible ng inyong insurance!',
    'modal.seniorTip2Title': '2. Libreng Hatid sa Pinto para sa Gamot na Pang-90 Araw',
    'modal.seniorTip2Desc': 'Hindi na kailangang bumiyahe. Ang suplay para sa tatlong buwan ay ihahatid diretso sa inyong pintuan nang may proteksyon sa temperatura.',
    'modal.seniorTip3Title': '3. Ipakita ang Digital Pass sa Parmasyutiko',
    'modal.seniorTip3Desc': 'Ipakita lamang ang inyong cellphone screen na may BIN, PCN, at Group number sa kahera ng parmasya.',
    'modal.close': 'Isara ang Gabay',
    'modal.callPharmacist': 'Tumawag sa Tulong sa Senior (1-800-633-4227)'
  },

  ko: {
    // Brand & Navigation
    'brand.name': 'PharmaCompare',
    'brand.tagline': '시니어 어르신 처방약 가격 비교 및 메디케어 절약 센터',
    'nav.screens': '13개 전체 기능 화면 보기',
    'nav.screensShort': '화면 목록',
    'nav.rxSearch': '약가 검색',
    'nav.routingAi': 'AI 스마트 경로',
    'nav.rxPass': '처방약 할인패스',
    'nav.teleconsult': '원격 진료',
    'nav.consumerMode': '환자 모드',
    'nav.enterpriseMode': '약국 관리',
    'nav.seniorMode': '시니어 어르신 모드',
    'nav.seniorAssist': '어르신 복약 지원',
    'nav.location': '캘리포니아 샌프란시스코',

    // Senior Accessibility Bar
    'senior.bannerTitle': '시니어 어르신 및 메디케어(Medicare) 전용 지원 센터',
    'senior.bannerSubtitle': '큰 글씨 모드, 친절한 음성 낭독, 메디케어 파트 D 절약 가이드 및 24시간 전담 약사 상담.',
    'senior.textSize': '글자 크기',
    'senior.normalText': '보통',
    'senior.largeText': '크게 (115%)',
    'senior.xlargeText': '아주 크게 (130%)',
    'senior.voiceReader': '음성으로 듣기',
    'senior.voiceActive': '음성 안내 중...',
    'senior.voiceStop': '음성 중지',
    'senior.hotline': '메디케어 상담: 1-800-MEDICARE',
    'senior.pharmacistCall': '약사 상담 전화',
    'senior.howItWorks': '어르신 안내서',
    'senior.medicareNote': '메디케어 파트 D, 메디케어 어드밴티지와 함께 쓰거나 자기부담금이 높을 때 현금 특가로 결제 가능합니다.',

    // Search & Drug Catalog
    'search.badge': '전국 실시간 약국 약가 비교',
    'search.title': '미국 내 처방약 가격 비교',
    'search.pharmacyCount': '68,000개 이상 약국',
    'search.subtitle': '제조사 직거래 도매가, 특별 할인 카드 및 시니어를 위한 90일 정기 무료 배송.',
    'search.placeholder': '약 이름 검색 (예: 아토르바스타틴 Atorvastatin, 메트포르민 Metformin, 오젬픽 Ozempic, 리시노프릴)...',
    'search.btn': '최저가 찾기',
    'search.trending': '어르신 다빈도 처방약:',
    'search.filter': '필터:',
    'search.allMeds': '모든 처방약',
    'search.genericOnly': '복제약(제네릭) 대체',
    'search.fastPickup': '15분 내 즉시 조제',
    'search.mailOrder': '무료 집 앞 배송',
    'search.classLabel': '약효 분류군:',
    'search.allClasses': '전체 분류',
    'search.showing': '검색 결과:',
    'search.matchingMeds': '개의 약품',
    'search.pricesCalibrated': '기준 우편번호:',
    'search.optimizeCart': '다약제 복합 최적화',

    // Drug Card
    'card.lowestCash': '최저 현금 특가',
    'card.save': '절약',
    'card.genericAvailable': '제네릭(복제약) 가능',
    'card.brandExclusive': '오리지널 전용 약품',
    'card.genericFor': '오리지널 약명:',
    'card.standard': '표준 복용량:',
    'card.form': '제형:',
    'card.qty': '처방 수량:',
    'card.at': '약국:',
    'card.configure': '용량 선택 및 가격비교',
    'card.digitalPass': '디지털 패스',
    'card.splitRoute': '배송 최적화',
    'card.listen': '약품 정보 및 가격 음성 안내',
    'card.audioDescription': '처방약 정보',

    // Stock Status
    'stock.ready15': '15분 내 준비 완료',
    'stock.inStock': '재고 있음',
    'stock.mailOrder': '2일 내 무료 배송',
    'stock.specialOrder': '특별 주문 필요',

    // Senior Modal
    'modal.seniorGuideTitle': '시니어 어르신 처방약 절약 가이드 및 메디케어 혜택 안내',
    'modal.seniorTip1Title': '1. 메디케어 코페이(Copay)보다 현금 할인가가 더 저렴한 경우',
    'modal.seniorTip1Desc': '아토르바스타틴, 메트포르민 등 만성 질환 필수약은 당사의 할인 패스로 8~12달러에 구매할 수 있어 보험 디덕터블(공제액)보다 훨씬 유리합니다.',
    'modal.seniorTip2Title': '2. 90일 만성질환약 집 앞까지 무료 정밀 온도 배송',
    'modal.seniorTip2Desc': '약국까지 직접 가지 않으셔도 안전하게 정밀 온도 센서가 부착된 안심 패키지로 3개월분이 무료 배송됩니다.',
    'modal.seniorTip3Title': '3. 약국 계산대에서 스마트폰 화면의 디지털 패스만 제시하세요',
    'modal.seniorTip3Desc': '화면에 적힌 BIN, PCN, Group 번호를 약사나 약국 직원에게 보여주시면 즉시 할인이 적용됩니다.',
    'modal.close': '안내창 닫기',
    'modal.callPharmacist': '어르신 전담 약사 연결 (1-800-633-4227)'
  }
};

interface LanguageContextType {
  language: LanguageCode;
  textSize: TextSize;
  isSeniorMode: boolean;
  isSpeaking: boolean;
  speakingText: string;
  setLanguage: (lang: LanguageCode) => void;
  setTextSize: (size: TextSize) => void;
  toggleSeniorMode: () => void;
  setSeniorMode: (enabled: boolean) => void;
  t: (key: string, fallback?: string) => string;
  currentLanguageOption: LanguageOption;
  speakText: (text: string, overrideLang?: LanguageCode) => void;
  stopSpeaking: () => void;
}

const LANG_STORAGE_KEY = 'pharmacompare_lang';
const TEXT_SIZE_STORAGE_KEY = 'pharmacompare_text_size';
const SENIOR_MODE_STORAGE_KEY = 'pharmacompare_senior_mode';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved && ['en', 'es', 'zh', 'vi', 'tl', 'ko'].includes(saved)) {
        return saved as LanguageCode;
      }
      // Auto detect user browser language
      if (typeof navigator !== 'undefined' && navigator.language) {
        const navLang = navigator.language.toLowerCase();
        if (navLang.startsWith('es')) return 'es';
        if (navLang.startsWith('zh')) return 'zh';
        if (navLang.startsWith('vi')) return 'vi';
        if (navLang.startsWith('tl') || navLang.startsWith('fil')) return 'tl';
        if (navLang.startsWith('ko')) return 'ko';
      }
    } catch {
      // Fallback
    }
    return 'en';
  });

  const [textSize, setTextSizeState] = useState<TextSize>(() => {
    try {
      const saved = localStorage.getItem(TEXT_SIZE_STORAGE_KEY);
      if (saved === 'normal' || saved === 'large' || saved === 'xlarge') {
        return saved as TextSize;
      }
    } catch {
      // Fallback
    }
    return 'normal';
  });

  const [isSeniorMode, setIsSeniorModeState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SENIOR_MODE_STORAGE_KEY);
      if (saved !== null) {
        return saved === 'true';
      }
    } catch {
      // Fallback
    }
    // Default enabled for convenience for senior visitors
    return false;
  });

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingText, setSpeakingText] = useState<string>('');

  // Sync root classes for text scaling
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-size-normal', 'text-size-large', 'text-size-xlarge', 'senior-mode-active');
    root.classList.add(`text-size-${textSize}`);
    if (isSeniorMode) {
      root.classList.add('senior-mode-active');
    }
  }, [textSize, isSeniorMode]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {}
    // If speaking, stop on language change
    stopSpeaking();
  };

  const setTextSize = (size: TextSize) => {
    setTextSizeState(size);
    try {
      localStorage.setItem(TEXT_SIZE_STORAGE_KEY, size);
    } catch {}
  };

  const setSeniorMode = (enabled: boolean) => {
    setIsSeniorModeState(enabled);
    try {
      localStorage.setItem(SENIOR_MODE_STORAGE_KEY, String(enabled));
    } catch {}
    // If turning on senior mode and text is normal, bump to large automatically for comfort
    if (enabled && textSize === 'normal') {
      setTextSize('large');
    }
  };

  const toggleSeniorMode = () => {
    setSeniorMode(!isSeniorMode);
  };

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const langDict = TRANSLATIONS[language];
      if (langDict && langDict[key]) {
        return langDict[key];
      }
      // Fallback to English
      const enDict = TRANSLATIONS.en;
      if (enDict && enDict[key]) {
        return enDict[key];
      }
      return fallback || key;
    },
    [language]
  );

  const currentLanguageOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Senior voice synthesizer
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingText('');
    }
  }, []);

  const speakText = useCallback(
    (text: string, overrideLang?: LanguageCode) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return;
      }

      // Stop any ongoing speech
      window.speechSynthesis.cancel();

      const langToUse = overrideLang || language;
      const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === langToUse) || SUPPORTED_LANGUAGES[0];

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langConfig.speechLocale;
      // Gentle, calm rate suitable for senior hearing
      utterance.rate = 0.88;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setSpeakingText(text);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setSpeakingText('');
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setSpeakingText('');
      };

      window.speechSynthesis.speak(utterance);
    },
    [language]
  );

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        language,
        textSize,
        isSeniorMode,
        isSpeaking,
        speakingText,
        setLanguage,
        setTextSize,
        toggleSeniorMode,
        setSeniorMode,
        t,
        currentLanguageOption,
        speakText,
        stopSpeaking
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
