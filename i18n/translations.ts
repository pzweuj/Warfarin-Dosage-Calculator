export const translations = {
  zh: {
    // 通用
    title: "华法林剂量计算器",
    subtitle: "基于多种算法模型的华法林初始剂量预测",
    calculate: "计算剂量",
    result: "计算结果",
    weeklyDose: "每周剂量",
    dailyDose: "每日剂量",
    required: "必填",
    optional: "可选",
    unknown: "未知",
    yes: "是",
    no: "否",

    // 警告信息
    warning: "重要提示",
    warningText: "此计算器仅供医疗专业人员参考使用，不能替代临床判断。实际用药请遵循医生指导并定期监测INR。",
    resultNote:
      "注意：此为预测的初始剂量，实际治疗中需要根据INR监测结果调整剂量。建议在开始治疗后3-5天检测INR，并根据结果调整剂量。",

    // 模型选择
    selectModel: "选择计算模型",
    currentModel: "当前模型",

    // 模型名称
    models: {
      iwpc: "IWPC模型",
      gage: "Gage模型",
      xiangya: "湘雅模型",
      biss: "Biss模型",
      clover: "苜蓿草模型",
    },

    // 模型描述
    modelDescriptions: {
      iwpc: "国际华法林药物基因组学联盟模型，基于大规模多中心研究",
      gage: "基于临床和遗传学因素的华法林剂量预测模型，考虑体表面积等因素",
      xiangya: "中南大学湘雅医院开发的适用于中国人群的华法林剂量预测模型",
      biss: "Biss华法林剂量计算模型，特别适用于儿科患者和Fontan手术患者",
      clover: "苜蓿草华法林剂量预测算法，考虑性别差异和体表面积因素",
    },

    // 患者信息
    patientInfo: "患者基本信息",
    patientInfoDesc: "请填写患者的基本临床信息",
    age: "年龄",
    ageUnit: "岁",
    height: "身高",
    heightUnit: "cm",
    weight: "体重",
    weightUnit: "kg",
    race: "种族",
    targetINR: "目标INR",
    bsa: "体表面积",
    bsaUnit: "m²",
    bsaDesc: "体表面积将根据身高体重自动计算",
    gender: "性别",

    // 性别选项
    genders: {
      male: "男性",
      female: "女性",
    },

    // 种族选项
    races: {
      white: "白种人",
      asian: "亚洲人",
      black: "黑人/非裔美国人",
      mixed: "混合种族/其他",
    },

    // 遗传学信息
    genetics: "遗传学信息",
    geneticsDesc: "基因型信息（如未检测请选择未知）",
    cyp2c9: "CYP2C9基因型",
    vkorc1: "VKORC1基因型",
    enzymeInducer: "是否使用酶诱导剂",
    amiodarone: "是否使用胺碘酮",

    // 临床信息
    clinicalInfo: "临床信息",
    clinicalInfoDesc: "请填写患者的临床病史和用药情况",
    smoking: "是否吸烟",
    dvtPe: "是否有深静脉血栓/肺栓塞",
    strokeHistory: "术前卒中史",
    hypertension: "高血压病",
    inrElevatingDrugs: "合用致INR升高的药物数量",
    inrElevatingDrugsDesc: "请输入同时使用的可能导致INR升高的药物数量",

    // 基因型选项
    genotypes: {
      cyp2c9: {
        "1_1": "*1/*1 (野生型)",
        "1_2": "*1/*2",
        "1_3": "*1/*3",
        "2_2": "*2/*2",
        "2_3": "*2/*3",
        "3_3": "*3/*3",
      },
      vkorc1: {
        GG: "GG (野生型)",
        AG: "AG",
        AA: "AA",
      },
    },

    // 适应症
    indication: "适应症",
    indications: {
      fontan: "Fontan手术",
      other: "其他适应症",
    },

    // CYP2C9等位基因数
    cyp2c9Alleles: "CYP2C9等位基因",
    cyp2c9_2_alleles: "CYP2C9*2等位基因数",
    cyp2c9_3_alleles: "CYP2C9*3等位基因数",
    alleleCount: "等位基因数量",

    // 关于信息
    about: "关于",
    aboutIwpc: "IWPC (国际华法林药物基因组学联盟) 公式是基于大规模多中心研究开发的华法林剂量预测模型。",
    aboutGage:
      "Gage模型是一个综合考虑临床和遗传学因素的华法林剂量预测模型，特别考虑了体表面积、吸烟状态和血栓病史等因素。",
    aboutXiangya:
      "湘雅模型是中南大学湘雅医院基于中国人群数据开发的华法林剂量预测模型，特别适用于中国患者，考虑了中国人群特有的临床特征。",
    aboutClover: "苜蓿草模型是一个考虑性别差异的华法林剂量预测模型，特别关注体表面积和性别对华法林剂量需求的影响。",
    aboutBiss: "Biss模型是专门为儿科患者开发的华法林剂量预测模型，特别考虑了Fontan手术等特殊适应症的影响。",
    factors: "主要考虑因素：",
    reference: "参考文献：",
    factorsList: [
      "患者年龄、身高、体重",
      "种族差异",
      "CYP2C9基因多态性（影响华法林代谢）",
      "VKORC1基因多态性（影响华法林敏感性）",
      "合并用药（酶诱导剂、胺碘酮等）",
    ],
    gageFactorsList: [
      "体表面积（根据身高体重计算）",
      "VKORC1基因多态性",
      "CYP2C9 *2和*3变异",
      "患者年龄",
      "目标INR值",
      "胺碘酮使用情况",
      "吸烟状态",
      "种族（非洲人或非裔美国人）",
      "深静脉血栓/肺栓塞病史",
    ],
    xiangyaFactorsList: [
      "VKORC1基因型（AA、AG、GG）",
      "CYP2C9*3变异",
      "体表面积（根据身高体重计算）",
      "患者年龄",
      "合用致INR升高的药物数量",
      "吸烟状态",
      "术前卒中史",
      "高血压病史",
    ],
    cloverFactorsList: [
      "VKORC1基因型（AA、AG、GG）",
      "CYP2C9*3变异",
      "体表面积（根据身高体重计算）",
      "患者年龄",
      "性别差异",
      "胺碘酮使用情况",
    ],
    bissFactorsList: [
      "患者身高",
      "VKORC1基因型（AA、AG、GG）",
      "CYP2C9*2等位基因数量",
      "CYP2C9*3等位基因数量",
      "适应症类型（Fontan手术vs其他）",
    ],

    // 参考文献链接（保留字段，待填入实际链接）
    referenceLinks: {
      iwpc: "https://example.com/iwpc-reference", // 待替换为实际IWPC参考文献链接
      gage: "https://example.com/gage-reference", // 待替换为实际Gage参考文献链接
      xiangya: "https://example.com/xiangya-reference", // 待替换为实际湘雅参考文献链接
      clover: "https://example.com/clover-reference", // 待替换为实际苜蓿草参考文献链接
      biss: "https://example.com/biss-reference", // 待替换为实际Biss参考文献链接
    },

    // GitHub相关
    viewOnGithub: "在GitHub上查看",
    sourceCode: "源代码",

    // 表单验证
    validation: {
      fillRequired: "请填写所有必填字段",
      invalidAge: "请输入有效的年龄",
      invalidHeight: "请输入有效的身高",
      invalidWeight: "请输入有效的体重",
    },
  },

  en: {
    // Common
    title: "Warfarin Dose Calculator",
    subtitle: "Warfarin initial dose prediction based on multiple algorithm models",
    calculate: "Calculate Dose",
    result: "Calculation Result",
    weeklyDose: "Weekly Dose",
    dailyDose: "Daily Dose",
    required: "Required",
    optional: "Optional",
    unknown: "Unknown",
    yes: "Yes",
    no: "No",

    // Warning
    warning: "Important Notice",
    warningText:
      "This calculator is for reference by healthcare professionals only and cannot replace clinical judgment. Please follow physician guidance and monitor INR regularly.",
    resultNote:
      "Note: This is the predicted initial dose. Actual treatment requires dose adjustment based on INR monitoring results. It is recommended to check INR 3-5 days after starting treatment and adjust dose accordingly.",

    // Model Selection
    selectModel: "Select Model",
    currentModel: "Current Model",

    // Model Names
    models: {
      iwpc: "IWPC Model",
      gage: "Gage Model",
      xiangya: "Xiangya Model",
      biss: "Biss Model",
      clover: "Clover Model",
    },

    // Model Descriptions
    modelDescriptions: {
      iwpc: "International Warfarin Pharmacogenetics Consortium model based on large-scale multicenter studies",
      gage: "Warfarin dose prediction model based on clinical and genetic factors, considering body surface area",
      xiangya: "Warfarin dose prediction model developed by Xiangya Hospital for Chinese population",
      biss: "Biss warfarin dose calculation model, specifically designed for pediatric patients and Fontan surgery patients",
      clover: "Clover warfarin dose prediction algorithm considering gender differences and body surface area",
    },

    // Patient Information
    patientInfo: "Patient Basic Information",
    patientInfoDesc: "Please fill in the patient's basic clinical information",
    age: "Age",
    ageUnit: "years",
    height: "Height",
    heightUnit: "cm",
    weight: "Weight",
    weightUnit: "kg",
    race: "Race",
    targetINR: "Target INR",
    bsa: "Body Surface Area",
    bsaUnit: "m²",
    bsaDesc: "Body surface area will be calculated automatically from height and weight",
    gender: "Gender",

    // Gender Options
    genders: {
      male: "Male",
      female: "Female",
    },

    // Race Options
    races: {
      white: "White/Caucasian",
      asian: "Asian",
      black: "Black/African American",
      mixed: "Mixed Race/Other",
    },

    // Genetics
    genetics: "Genetic Information",
    geneticsDesc: "Genotype information (select 'Unknown' if not tested)",
    cyp2c9: "CYP2C9 Genotype",
    vkorc1: "VKORC1 Genotype",
    enzymeInducer: "Enzyme Inducer Use",
    amiodarone: "Amiodarone Use",

    // Clinical Information
    clinicalInfo: "Clinical Information",
    clinicalInfoDesc: "Please fill in patient's clinical history and medication status",
    smoking: "Smoking Status",
    dvtPe: "DVT/PE History",
    strokeHistory: "Pre-operative Stroke History",
    hypertension: "Hypertension",
    inrElevatingDrugs: "Number of INR-elevating Drugs",
    inrElevatingDrugsDesc: "Enter the number of concomitant drugs that may elevate INR",

    // Genotype Options
    genotypes: {
      cyp2c9: {
        "1_1": "*1/*1 (Wild type)",
        "1_2": "*1/*2",
        "1_3": "*1/*3",
        "2_2": "*2/*2",
        "2_3": "*2/*3",
        "3_3": "*3/*3",
      },
      vkorc1: {
        GG: "GG (Wild type)",
        AG: "AG",
        AA: "AA",
      },
    },

    // 适应症
    indication: "Indication",
    indications: {
      fontan: "Fontan Surgery",
      other: "Other Indications",
    },

    // CYP2C9等位基因数
    cyp2c9Alleles: "CYP2C9 Alleles",
    cyp2c9_2_alleles: "CYP2C9*2 Allele Count",
    cyp2c9_3_alleles: "CYP2C9*3 Allele Count",
    alleleCount: "Allele Count",

    // About
    about: "About",
    aboutIwpc:
      "The IWPC (International Warfarin Pharmacogenetics Consortium) formula is a warfarin dose prediction model developed based on large-scale multicenter studies.",
    aboutGage:
      "The Gage model is a comprehensive warfarin dose prediction model that considers clinical and genetic factors, with special attention to body surface area, smoking status, and thrombotic history.",
    aboutXiangya:
      "The Xiangya model is a warfarin dose prediction model developed by Xiangya Hospital of Central South University based on Chinese population data, particularly suitable for Chinese patients.",
    aboutClover:
      "The Clover model is a warfarin dose prediction model that considers gender differences, with particular focus on the impact of body surface area and gender on warfarin dose requirements.",
    aboutBiss:
      "The Biss model is a warfarin dose prediction model specifically developed for pediatric patients, with special consideration for the impact of Fontan surgery and other special indications.",
    factors: "Main Factors Considered:",
    reference: "Reference:",
    factorsList: [
      "Patient age, height, weight",
      "Racial differences",
      "CYP2C9 genetic polymorphisms (affecting warfarin metabolism)",
      "VKORC1 genetic polymorphisms (affecting warfarin sensitivity)",
      "Concomitant medications (enzyme inducers, amiodarone, etc.)",
    ],
    gageFactorsList: [
      "Body surface area (calculated from height and weight)",
      "VKORC1 genetic polymorphism",
      "CYP2C9 *2 and *3 variants",
      "Patient age",
      "Target INR value",
      "Amiodarone use",
      "Smoking status",
      "Race (African or African American)",
      "Deep vein thrombosis/pulmonary embolism history",
    ],
    xiangyaFactorsList: [
      "VKORC1 genotype (AA, AG, GG)",
      "CYP2C9*3 variant",
      "Body surface area (calculated from height and weight)",
      "Patient age",
      "Number of INR-elevating drugs",
      "Smoking status",
      "Pre-operative stroke history",
      "Hypertension history",
    ],
    cloverFactorsList: [
      "VKORC1 genotype (AA, AG, GG)",
      "CYP2C9*3 variant",
      "Body surface area (calculated from height and weight)",
      "Patient age",
      "Gender differences",
      "Amiodarone use",
    ],
    bissFactorsList: [
      "Patient height",
      "VKORC1 genotype (AA, AG, GG)",
      "Number of CYP2C9*2 alleles",
      "Number of CYP2C9*3 alleles",
      "Indication type (Fontan surgery vs others)",
    ],

    // 参考文献链接（保留字段，待填入实际链接）
    referenceLinks: {
      iwpc: "https://example.com/iwpc-reference", // To be replaced with actual IWPC reference link
      gage: "https://example.com/gage-reference", // To be replaced with actual Gage reference link
      xiangya: "https://example.com/xiangya-reference", // To be replaced with actual Xiangya reference link
      clover: "https://example.com/clover-reference", // To be replaced with actual Clover reference link
      biss: "https://example.com/biss-reference", // To be replaced with actual Biss reference link
    },

    // GitHub相关
    viewOnGithub: "View on GitHub",
    sourceCode: "Source Code",

    // Form Validation
    validation: {
      fillRequired: "Please fill in all required fields",
      invalidAge: "Please enter a valid age",
      invalidHeight: "Please enter a valid height",
      invalidWeight: "Please enter a valid weight",
    },
  },
} as const

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.zh
