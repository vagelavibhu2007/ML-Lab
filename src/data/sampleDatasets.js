// Pre-configured realistic sample datasets

export const SAMPLE_DATASETS = [
  {
    id: 'california-housing',
    name: 'California Housing Prices',
    filename: 'california_housing_train.csv',
    type: 'CSV',
    task: 'Regression',
    rows: 20640,
    columns: 9,
    size: '1.42 MB',
    uploadDate: '2026-03-10 14:22',
    targetColumn: 'median_house_value',
    description: '1990 California census data predicting median house values from spatial, demographic and housing attributes.',
    columnDetails: [
      { name: 'longitude', type: 'Float', missing: 0, unique: 849, sample: '-122.23' },
      { name: 'latitude', type: 'Float', missing: 0, unique: 862, sample: '37.88' },
      { name: 'housing_median_age', type: 'Integer', missing: 0, unique: 52, sample: '41' },
      { name: 'total_rooms', type: 'Integer', missing: 0, unique: 5926, sample: '880' },
      { name: 'total_bedrooms', type: 'Integer', missing: 207, unique: 1923, sample: '129' },
      { name: 'population', type: 'Integer', missing: 0, unique: 3882, sample: '322' },
      { name: 'households', type: 'Integer', missing: 0, unique: 1815, sample: '126' },
      { name: 'median_income', type: 'Float', missing: 0, unique: 12928, sample: '8.3252' },
      { name: 'median_house_value', type: 'Float (Target)', missing: 0, unique: 3842, sample: '452600.0' }
    ],
    sampleRows: [
      { longitude: -122.23, latitude: 37.88, housing_median_age: 41, total_rooms: 880, total_bedrooms: 129, population: 322, households: 126, median_income: 8.3252, median_house_value: 452600 },
      { longitude: -122.22, latitude: 37.86, housing_median_age: 21, total_rooms: 7099, total_bedrooms: 1106, population: 2401, households: 1138, median_income: 8.3014, median_house_value: 358500 },
      { longitude: -122.24, latitude: 37.85, housing_median_age: 52, total_rooms: 1467, total_bedrooms: 190, population: 496, households: 177, median_income: 7.2574, median_house_value: 352100 },
      { longitude: -122.25, latitude: 37.85, housing_median_age: 52, total_rooms: 1274, total_bedrooms: 235, population: 558, households: 219, median_income: 5.6431, median_house_value: 341300 },
      { longitude: -122.25, latitude: 37.85, housing_median_age: 52, total_rooms: 1627, total_bedrooms: 280, population: 565, households: 259, median_income: 3.8462, median_house_value: 342200 },
      { longitude: -122.25, latitude: 37.85, housing_median_age: 52, total_rooms: 919, total_bedrooms: 213, population: 413, households: 193, median_income: 4.0368, median_house_value: 269700 },
      { longitude: -122.25, latitude: 37.84, housing_median_age: 52, total_rooms: 2535, total_bedrooms: 489, population: 1094, households: 514, median_income: 3.6591, median_house_value: 299200 },
      { longitude: -122.25, latitude: 37.84, housing_median_age: 52, total_rooms: 3104, total_bedrooms: 687, population: 1157, households: 647, median_income: 3.1200, median_house_value: 241400 },
      { longitude: -122.26, latitude: 37.84, housing_median_age: 42, total_rooms: 2555, total_bedrooms: 665, population: 1206, households: 595, median_income: 2.0804, median_house_value: 226700 },
      { longitude: -122.25, latitude: 37.84, housing_median_age: 52, total_rooms: 3549, total_bedrooms: 707, population: 1551, households: 714, median_income: 3.6912, median_house_value: 261100 }
    ]
  },
  {
    id: 'customer-churn',
    name: 'Telco Customer Churn',
    filename: 'telco_customer_churn.csv',
    type: 'CSV',
    task: 'Classification',
    rows: 7043,
    columns: 10,
    size: '970 KB',
    uploadDate: '2026-03-12 09:15',
    targetColumn: 'Churn',
    description: 'Telecom customer demographic records, subscription packages, and tenure used to predict customer churn probability.',
    columnDetails: [
      { name: 'customerID', type: 'String', missing: 0, unique: 7043, sample: '7590-VHVEG' },
      { name: 'gender', type: 'Category', missing: 0, unique: 2, sample: 'Female' },
      { name: 'SeniorCitizen', type: 'Integer (0/1)', missing: 0, unique: 2, sample: '0' },
      { name: 'tenure', type: 'Integer (months)', missing: 0, unique: 73, sample: '12' },
      { name: 'PhoneService', type: 'Category', missing: 0, unique: 2, sample: 'Yes' },
      { name: 'Contract', type: 'Category', missing: 0, unique: 3, sample: 'Month-to-month' },
      { name: 'PaperlessBilling', type: 'Category', missing: 0, unique: 2, sample: 'Yes' },
      { name: 'PaymentMethod', type: 'Category', missing: 0, unique: 4, sample: 'Electronic check' },
      { name: 'MonthlyCharges', type: 'Float', missing: 0, unique: 1585, sample: '29.85' },
      { name: 'Churn', type: 'Category (Target)', missing: 0, unique: 2, sample: 'No' }
    ],
    sampleRows: [
      { customerID: '7590-VHVEG', gender: 'Female', SeniorCitizen: 0, tenure: 1, Contract: 'Month-to-month', PaperlessBilling: 'Yes', PaymentMethod: 'Electronic check', MonthlyCharges: 29.85, Churn: 'No' },
      { customerID: '5575-GNVDE', gender: 'Male', SeniorCitizen: 0, tenure: 34, Contract: 'One year', PaperlessBilling: 'No', PaymentMethod: 'Mailed check', MonthlyCharges: 56.95, Churn: 'No' },
      { customerID: '3668-QPYBK', gender: 'Male', SeniorCitizen: 0, tenure: 2, Contract: 'Month-to-month', PaperlessBilling: 'Yes', PaymentMethod: 'Mailed check', MonthlyCharges: 53.85, Churn: 'Yes' },
      { customerID: '7795-CFOCW', gender: 'Male', SeniorCitizen: 0, tenure: 45, Contract: 'One year', PaperlessBilling: 'No', PaymentMethod: 'Bank transfer', MonthlyCharges: 42.30, Churn: 'No' },
      { customerID: '9237-HQITU', gender: 'Female', SeniorCitizen: 0, tenure: 2, Contract: 'Month-to-month', PaperlessBilling: 'Yes', PaymentMethod: 'Electronic check', MonthlyCharges: 70.70, Churn: 'Yes' },
      { customerID: '9305-CDSKC', gender: 'Female', SeniorCitizen: 0, tenure: 8, Contract: 'Month-to-month', PaperlessBilling: 'Yes', PaymentMethod: 'Electronic check', MonthlyCharges: 99.65, Churn: 'Yes' },
      { customerID: '1452-KIOVK', gender: 'Male', SeniorCitizen: 0, tenure: 22, Contract: 'Month-to-month', PaperlessBilling: 'Yes', PaymentMethod: 'Credit card', MonthlyCharges: 89.10, Churn: 'No' }
    ]
  },
  {
    id: 'medical-insurance',
    name: 'Medical Cost Personal Insurance',
    filename: 'insurance_charges.csv',
    type: 'CSV',
    task: 'Regression',
    rows: 1338,
    columns: 7,
    size: '128 KB',
    uploadDate: '2026-03-14 11:45',
    targetColumn: 'charges',
    description: 'Individual medical expenses billed by health insurance according to BMI, smoking habits, age, and location.',
    columnDetails: [
      { name: 'age', type: 'Integer', missing: 0, unique: 47, sample: '19' },
      { name: 'sex', type: 'Category', missing: 0, unique: 2, sample: 'female' },
      { name: 'bmi', type: 'Float', missing: 0, unique: 548, sample: '27.9' },
      { name: 'children', type: 'Integer', missing: 0, unique: 6, sample: '0' },
      { name: 'smoker', type: 'Category', missing: 0, unique: 2, sample: 'yes' },
      { name: 'region', type: 'Category', missing: 0, unique: 4, sample: 'southwest' },
      { name: 'charges', type: 'Float (Target)', missing: 0, unique: 1337, sample: '16884.92' }
    ],
    sampleRows: [
      { age: 19, sex: 'female', bmi: 27.900, children: 0, smoker: 'yes', region: 'southwest', charges: 16884.92 },
      { age: 18, sex: 'male', bmi: 33.770, children: 1, smoker: 'no', region: 'southeast', charges: 1725.55 },
      { age: 28, sex: 'male', bmi: 33.000, children: 3, smoker: 'no', region: 'southeast', charges: 4449.46 },
      { age: 33, sex: 'male', bmi: 22.705, children: 0, smoker: 'no', region: 'northwest', charges: 21984.47 },
      { age: 32, sex: 'male', bmi: 28.880, children: 0, smoker: 'no', region: 'northwest', charges: 3866.86 },
      { age: 31, sex: 'female', bmi: 25.740, children: 0, smoker: 'no', region: 'southeast', charges: 3756.62 },
      { age: 46, sex: 'female', bmi: 33.440, children: 1, smoker: 'no', region: 'southeast', charges: 8240.59 }
    ]
  },
  {
    id: 'credit-risk',
    name: 'Credit Card Default & Risk',
    filename: 'credit_card_defaults.csv',
    type: 'CSV',
    task: 'Classification',
    rows: 5000,
    columns: 10,
    size: '640 KB',
    uploadDate: '2026-03-15 16:30',
    targetColumn: 'default_payment',
    description: 'Bank credit records assessing likelihood of customer defaulting on upcoming monthly statement payment.',
    columnDetails: [
      { name: 'LIMIT_BAL', type: 'Float', missing: 0, unique: 81, sample: '20000' },
      { name: 'SEX', type: 'Category', missing: 0, unique: 2, sample: '2' },
      { name: 'EDUCATION', type: 'Category', missing: 0, unique: 4, sample: '2' },
      { name: 'MARRIAGE', type: 'Category', missing: 0, unique: 3, sample: '1' },
      { name: 'AGE', type: 'Integer', missing: 0, unique: 56, sample: '24' },
      { name: 'PAY_0', type: 'Integer', missing: 0, unique: 11, sample: '2' },
      { name: 'BILL_AMT1', type: 'Float', missing: 0, unique: 4323, sample: '3913' },
      { name: 'PAY_AMT1', type: 'Float', missing: 0, unique: 2901, sample: '0' },
      { name: 'default_payment', type: 'Integer (Target)', missing: 0, unique: 2, sample: '1' }
    ],
    sampleRows: [
      { LIMIT_BAL: 20000, SEX: 'Female', EDUCATION: 'University', MARRIAGE: 'Married', AGE: 24, PAY_0: 2, BILL_AMT1: 3913, PAY_AMT1: 0, default_payment: 1 },
      { LIMIT_BAL: 120000, SEX: 'Female', EDUCATION: 'University', MARRIAGE: 'Single', AGE: 26, PAY_0: -1, BILL_AMT1: 2682, PAY_AMT1: 0, default_payment: 1 },
      { LIMIT_BAL: 90000, SEX: 'Female', EDUCATION: 'University', MARRIAGE: 'Single', AGE: 34, PAY_0: 0, BILL_AMT1: 29239, PAY_AMT1: 1518, default_payment: 0 },
      { LIMIT_BAL: 50000, SEX: 'Female', EDUCATION: 'Grad School', MARRIAGE: 'Single', AGE: 37, PAY_0: 0, BILL_AMT1: 46990, PAY_AMT1: 2000, default_payment: 0 },
      { LIMIT_BAL: 50000, SEX: 'Male', EDUCATION: 'Grad School', MARRIAGE: 'Married', AGE: 57, PAY_0: -1, BILL_AMT1: 8617, PAY_AMT1: 2000, default_payment: 0 }
    ]
  },
  {
    id: 'wine-quality',
    name: 'Wine Quality Analysis',
    filename: 'wine_quality_red.csv',
    type: 'CSV',
    task: 'Regression',
    rows: 1599,
    columns: 12,
    size: '284 KB',
    uploadDate: '2026-03-18 18:00',
    targetColumn: 'quality',
    description: 'Physicochemical properties of red Vinho Verde wine variants from Portugal with quality scores from 3 to 8.',
    columnDetails: [
      { name: 'fixed acidity', type: 'Float', missing: 0, unique: 96, sample: '7.4' },
      { name: 'volatile acidity', type: 'Float', missing: 0, unique: 143, sample: '0.70' },
      { name: 'citric acid', type: 'Float', missing: 0, unique: 80, sample: '0.00' },
      { name: 'residual sugar', type: 'Float', missing: 0, unique: 91, sample: '1.9' },
      { name: 'chlorides', type: 'Float', missing: 0, unique: 153, sample: '0.076' },
      { name: 'free sulfur dioxide', type: 'Float', missing: 0, unique: 60, sample: '11.0' },
      { name: 'density', type: 'Float', missing: 0, unique: 436, sample: '0.9978' },
      { name: 'pH', type: 'Float', missing: 0, unique: 89, sample: '3.51' },
      { name: 'sulphates', type: 'Float', missing: 0, unique: 96, sample: '0.56' },
      { name: 'alcohol', type: 'Float', missing: 0, unique: 65, sample: '9.4' },
      { name: 'quality', type: 'Integer (Target)', missing: 0, unique: 6, sample: '5' }
    ],
    sampleRows: [
      { 'fixed acidity': 7.4, 'volatile acidity': 0.70, 'citric acid': 0.00, 'residual sugar': 1.9, 'chlorides': 0.076, 'alcohol': 9.4, quality: 5 },
      { 'fixed acidity': 7.8, 'volatile acidity': 0.88, 'citric acid': 0.00, 'residual sugar': 2.6, 'chlorides': 0.098, 'alcohol': 9.8, quality: 5 },
      { 'fixed acidity': 7.8, 'volatile acidity': 0.76, 'citric acid': 0.04, 'residual sugar': 2.3, 'chlorides': 0.092, 'alcohol': 9.8, quality: 5 },
      { 'fixed acidity': 11.2, 'volatile acidity': 0.28, 'citric acid': 0.56, 'residual sugar': 1.9, 'chlorides': 0.075, 'alcohol': 9.8, quality: 6 },
      { 'fixed acidity': 7.4, 'volatile acidity': 0.66, 'citric acid': 0.00, 'residual sugar': 1.8, 'chlorides': 0.075, 'alcohol': 9.4, quality: 5 }
    ]
  }
];
