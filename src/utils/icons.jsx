import {
  Heart,
  Star,
  Circle,
  Square,
  Triangle,
  Diamond,
  Hexagon,
  Music,
  Sun,
  Moon,
  Cloud,
  Zap,
  Flame,
  Droplet,
  Leaf,
  Flower,
  Apple,
  Coffee,
  Home,
  Car,
  Plane,
  Ship,
  Camera,
  Phone,
  Mail,
  Gift,
  Crown,
  Shield,
  Sword,
  Key,
  Lock,
  Bell,
  Rocket,
  Compass,
  Mountain,
  Waves,
  Snowflake,
  Rainbow,
  Feather,
  Fan,
  Fish,
  Bird,
  Cat,
  Dog,
  Rabbit,
  Turtle,
  Bone,
  Squirrel,
  Anchor,
  Palette,
} from 'lucide-react'

import Flag from 'react-world-flags'

const createFlagComponent = countryCode => {
  return ({ size = 28, style, ...props }) => (
    <Flag
      code={countryCode}
      height={size}
      style={{
        border: '1px solid rgba(0,0,0,0.15)',
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1)',
        filter: 'brightness(1.05) contrast(1.1)',
        ...style,
      }}
      {...props}
    />
  )
}

// North America
const USFlag = createFlagComponent('US') // United States
const CAFlag = createFlagComponent('CA') // Canada
const MXFlag = createFlagComponent('MX') // Mexico
const GTFlag = createFlagComponent('GT') // Guatemala
const BZFlag = createFlagComponent('BZ') // Belize
const SVFlag = createFlagComponent('SV') // El Salvador
const HNFlag = createFlagComponent('HN') // Honduras
const NIFlag = createFlagComponent('NI') // Nicaragua
const CRFlag = createFlagComponent('CR') // Costa Rica
const PAFlag = createFlagComponent('PA') // Panama
const CUFlag = createFlagComponent('CU') // Cuba
const JMFlag = createFlagComponent('JM') // Jamaica
const HTFlag = createFlagComponent('HT') // Haiti
const DOFlag = createFlagComponent('DO') // Dominican Republic
const BBFlag = createFlagComponent('BB') // Barbados
const TTFlag = createFlagComponent('TT') // Trinidad and Tobago
const BSFlag = createFlagComponent('BS') // Bahamas
const DMFlag = createFlagComponent('DM') // Dominica
const GDFlag = createFlagComponent('GD') // Grenada
const KNFlag = createFlagComponent('KN') // Saint Kitts and Nevis
const LCFlag = createFlagComponent('LC') // Saint Lucia
const VCFlag = createFlagComponent('VC') // Saint Vincent and the Grenadines
const AGFlag = createFlagComponent('AG') // Antigua and Barbuda

// South America
const BRFlag = createFlagComponent('BR') // Brazil
const ARFlag = createFlagComponent('AR') // Argentina
const COFlag = createFlagComponent('CO') // Colombia
const VEFlag = createFlagComponent('VE') // Venezuela
const PEFlag = createFlagComponent('PE') // Peru
const ECFlag = createFlagComponent('EC') // Ecuador
const BOFlag = createFlagComponent('BO') // Bolivia
const CLFlag = createFlagComponent('CL') // Chile
const UYFlag = createFlagComponent('UY') // Uruguay
const PYFlag = createFlagComponent('PY') // Paraguay
const GYFlag = createFlagComponent('GY') // Guyana
const SRFlag = createFlagComponent('SR') // Suriname

// Europe
const GBFlag = createFlagComponent('GB') // United Kingdom
const FRFlag = createFlagComponent('FR') // France
const DEFlag = createFlagComponent('DE') // Germany
const ITFlag = createFlagComponent('IT') // Italy
const ESFlag = createFlagComponent('ES') // Spain
const NLFlag = createFlagComponent('NL') // Netherlands
const SEFlag = createFlagComponent('SE') // Sweden
const NOFlag = createFlagComponent('NO') // Norway
const DKFlag = createFlagComponent('DK') // Denmark
const FIFlag = createFlagComponent('FI') // Finland
const ISFlag = createFlagComponent('IS') // Iceland
const IEFlag = createFlagComponent('IE') // Ireland
const PTFlag = createFlagComponent('PT') // Portugal
const CHFlag = createFlagComponent('CH') // Switzerland
const ATFlag = createFlagComponent('AT') // Austria
const BEFlag = createFlagComponent('BE') // Belgium
const LUFlag = createFlagComponent('LU') // Luxembourg
const PLFlag = createFlagComponent('PL') // Poland
const CZFlag = createFlagComponent('CZ') // Czech Republic
const SKFlag = createFlagComponent('SK') // Slovakia
const HUFlag = createFlagComponent('HU') // Hungary
const SIFlag = createFlagComponent('SI') // Slovenia
const HRFlag = createFlagComponent('HR') // Croatia
const BAFlag = createFlagComponent('BA') // Bosnia and Herzegovina
const RSFlag = createFlagComponent('RS') // Serbia
const MEFlag = createFlagComponent('ME') // Montenegro
const MKFlag = createFlagComponent('MK') // North Macedonia
const ALFlag = createFlagComponent('AL') // Albania
const GRFlag = createFlagComponent('GR') // Greece
const BGFlag = createFlagComponent('BG') // Bulgaria
const ROFlag = createFlagComponent('RO') // Romania
const MDFlag = createFlagComponent('MD') // Moldova
const UAFlag = createFlagComponent('UA') // Ukraine
const BYFlag = createFlagComponent('BY') // Belarus
const RUFlag = createFlagComponent('RU') // Russia
const LTFlag = createFlagComponent('LT') // Lithuania
const LVFlag = createFlagComponent('LV') // Latvia
const EEFlag = createFlagComponent('EE') // Estonia
const MTFlag = createFlagComponent('MT') // Malta
const CYFlag = createFlagComponent('CY') // Cyprus
const MCFlag = createFlagComponent('MC') // Monaco
const SMFlag = createFlagComponent('SM') // San Marino
const VAFlag = createFlagComponent('VA') // Vatican City
const ADFlag = createFlagComponent('AD') // Andorra
const LIFlag = createFlagComponent('LI') // Liechtenstein

// Asia
const CNFlag = createFlagComponent('CN') // China
const INFlag = createFlagComponent('IN') // India
const JPFlag = createFlagComponent('JP') // Japan
const KRFlag = createFlagComponent('KR') // South Korea
const KPFlag = createFlagComponent('KP') // North Korea
const IDFlag = createFlagComponent('ID') // Indonesia
const THFlag = createFlagComponent('TH') // Thailand
const VNFlag = createFlagComponent('VN') // Vietnam
const PHFlag = createFlagComponent('PH') // Philippines
const MYFlag = createFlagComponent('MY') // Malaysia
const SGFlag = createFlagComponent('SG') // Singapore
const BNFlag = createFlagComponent('BN') // Brunei
const LAFlag = createFlagComponent('LA') // Laos
const KHFlag = createFlagComponent('KH') // Cambodia
const MMFlag = createFlagComponent('MM') // Myanmar
const LKFlag = createFlagComponent('LK') // Sri Lanka
const MVFlag = createFlagComponent('MV') // Maldives
const BTFlag = createFlagComponent('BT') // Bhutan
const NPFlag = createFlagComponent('NP') // Nepal
const BDFlag = createFlagComponent('BD') // Bangladesh
const PKFlag = createFlagComponent('PK') // Pakistan
const AFFlag = createFlagComponent('AF') // Afghanistan
const IRFlag = createFlagComponent('IR') // Iran
const IQFlag = createFlagComponent('IQ') // Iraq
const SYFlag = createFlagComponent('SY') // Syria
const LBFlag = createFlagComponent('LB') // Lebanon
const JOFlag = createFlagComponent('JO') // Jordan
const ILFlag = createFlagComponent('IL') // Israel
const PSFlag = createFlagComponent('PS') // Palestine
const SAFlag = createFlagComponent('SA') // Saudi Arabia
const YEFlag = createFlagComponent('YE') // Yemen
const OMFlag = createFlagComponent('OM') // Oman
const AEFlag = createFlagComponent('AE') // United Arab Emirates
const QAFlag = createFlagComponent('QA') // Qatar
const BHFlag = createFlagComponent('BH') // Bahrain
const KWFlag = createFlagComponent('KW') // Kuwait
const TRFlag = createFlagComponent('TR') // Turkey
const GEFlag = createFlagComponent('GE') // Georgia
const AMFlag = createFlagComponent('AM') // Armenia
const AZFlag = createFlagComponent('AZ') // Azerbaijan
const KZFlag = createFlagComponent('KZ') // Kazakhstan
const KGFlag = createFlagComponent('KG') // Kyrgyzstan
const TJFlag = createFlagComponent('TJ') // Tajikistan
const UZFlag = createFlagComponent('UZ') // Uzbekistan
const TMFlag = createFlagComponent('TM') // Turkmenistan
const MNFlag = createFlagComponent('MN') // Mongolia
const TWFlag = createFlagComponent('TW') // Taiwan
const HKFlag = createFlagComponent('HK') // Hong Kong
const MOFlag = createFlagComponent('MO') // Macao

// Africa
const NGFlag = createFlagComponent('NG') // Nigeria
const ZAFlag = createFlagComponent('ZA') // South Africa
const EGFlag = createFlagComponent('EG') // Egypt
const ETFlag = createFlagComponent('ET') // Ethiopia
const KEFlag = createFlagComponent('KE') // Kenya
const GHFlag = createFlagComponent('GH') // Ghana
const UGFlag = createFlagComponent('UG') // Uganda
const TNFlag = createFlagComponent('TN') // Tunisia
const MAFlag = createFlagComponent('MA') // Morocco
const DZFlag = createFlagComponent('DZ') // Algeria
const LYFlag = createFlagComponent('LY') // Libya
const SDFlag = createFlagComponent('SD') // Sudan
const SSFlag = createFlagComponent('SS') // South Sudan
const TZFlag = createFlagComponent('TZ') // Tanzania
const AOFlag = createFlagComponent('AO') // Angola
const MZFlag = createFlagComponent('MZ') // Mozambique
const ZMFlag = createFlagComponent('ZM') // Zambia
const ZWFlag = createFlagComponent('ZW') // Zimbabwe
const BWFlag = createFlagComponent('BW') // Botswana
const NAFlag = createFlagComponent('NA') // Namibia
const LSFlag = createFlagComponent('LS') // Lesotho
const SZFlag = createFlagComponent('SZ') // Eswatini
const MWFlag = createFlagComponent('MW') // Malawi
const RWFlag = createFlagComponent('RW') // Rwanda
const BIFlag = createFlagComponent('BI') // Burundi
const DJFlag = createFlagComponent('DJ') // Djibouti
const SOFlag = createFlagComponent('SO') // Somalia
const ERFlag = createFlagComponent('ER') // Eritrea
const CDFlag = createFlagComponent('CD') // Democratic Republic of Congo
const CGFlag = createFlagComponent('CG') // Republic of Congo
const CFFlag = createFlagComponent('CF') // Central African Republic
const CMFlag = createFlagComponent('CM') // Cameroon
const TDFlag = createFlagComponent('TD') // Chad
const NEFlag = createFlagComponent('NE') // Niger
const MLFlag = createFlagComponent('ML') // Mali
const BFFlag = createFlagComponent('BF') // Burkina Faso
const CIFlag = createFlagComponent('CI') // Ivory Coast
const LRFlag = createFlagComponent('LR') // Liberia
const SLFlag = createFlagComponent('SL') // Sierra Leone
const GNFlag = createFlagComponent('GN') // Guinea
const GWFlag = createFlagComponent('GW') // Guinea-Bissau
const SNFlag = createFlagComponent('SN') // Senegal
const GMFlag = createFlagComponent('GM') // Gambia
const MRFlag = createFlagComponent('MR') // Mauritania
const CVFlag = createFlagComponent('CV') // Cape Verde
const STFlag = createFlagComponent('ST') // São Tomé and Príncipe
const GQFlag = createFlagComponent('GQ') // Equatorial Guinea
const GAFlag = createFlagComponent('GA') // Gabon
const MUFlag = createFlagComponent('MU') // Mauritius
const SCFlag = createFlagComponent('SC') // Seychelles
const KMFlag = createFlagComponent('KM') // Comoros
const MGFlag = createFlagComponent('MG') // Madagascar

// Oceania
const AUFlag = createFlagComponent('AU') // Australia
const NZFlag = createFlagComponent('NZ') // New Zealand
const FJFlag = createFlagComponent('FJ') // Fiji
const PGFlag = createFlagComponent('PG') // Papua New Guinea
const SBFlag = createFlagComponent('SB') // Solomon Islands
const VUFlag = createFlagComponent('VU') // Vanuatu
const NCFlag = createFlagComponent('NC') // New Caledonia
const PWFlag = createFlagComponent('PW') // Palau
const MHFlag = createFlagComponent('MH') // Marshall Islands
const FMFlag = createFlagComponent('FM') // Federated States of Micronesia
const NRFlag = createFlagComponent('NR') // Nauru
const KIFlag = createFlagComponent('KI') // Kiribati
const TVFlag = createFlagComponent('TV') // Tuvalu
const TOFlag = createFlagComponent('TO') // Tonga
const WSFlag = createFlagComponent('WS') // Samoa
const CKFlag = createFlagComponent('CK') // Cook Islands
const NUFlag = createFlagComponent('NU') // Niue
const PFFlag = createFlagComponent('PF') // French Polynesia

export const ICON_MAP = {
  Heart,
  Star,
  Circle,
  Square,
  Triangle,
  Diamond,
  Hexagon,
  Music,
  Sun,
  Moon,
  Cloud,
  Zap,
  Flame,
  Droplet,
  Leaf,
  Flower,
  Apple,
  Coffee,
  Home,
  Car,
  Plane,
  Ship,
  Camera,
  Phone,
  Mail,
  Gift,
  Crown,
  Shield,
  Sword,
  Key,
  Lock,
  Bell,
  Rocket,
  Compass,
  Mountain,
  Waves,
  Snowflake,
  Rainbow,
  Feather,
  Fan,
  Fish,
  Bone,
  Cat,
  Dog,
  Rabbit,
  Turtle,
  Bird,
  Squirrel,
  Anchor,
  Palette,
  USFlag,
  CAFlag,
  GBFlag,
  FRFlag,
  DEFlag,
  ITFlag,
  ESFlag,
  JPFlag,
  CNFlag,
  INFlag,
  BRFlag,
  AUFlag,
  MXFlag,
  RUFlag,
  KRFlag,
  NGFlag,
  ARFlag,
  ZAFlag,
  NLFlag,
  SEFlag,
  GTFlag,
  BZFlag,
  SVFlag,
  HNFlag,
  NIFlag,
  CRFlag,
  PAFlag,
  CUFlag,
  JMFlag,
  HTFlag,
  DOFlag,
  BBFlag,
  TTFlag,
  BSFlag,
  DMFlag,
  GDFlag,
  KNFlag,
  LCFlag,
  VCFlag,
  AGFlag,
  COFlag,
  VEFlag,
  PEFlag,
  ECFlag,
  BOFlag,
  CLFlag,
  UYFlag,
  PYFlag,
  GYFlag,
  SRFlag,
  NOFlag,
  DKFlag,
  FIFlag,
  ISFlag,
  IEFlag,
  PTFlag,
  CHFlag,
  ATFlag,
  BEFlag,
  LUFlag,
  PLFlag,
  CZFlag,
  SKFlag,
  HUFlag,
  SIFlag,
  HRFlag,
  BAFlag,
  RSFlag,
  MEFlag,
  MKFlag,
  ALFlag,
  GRFlag,
  BGFlag,
  ROFlag,
  MDFlag,
  UAFlag,
  BYFlag,
  LTFlag,
  LVFlag,
  EEFlag,
  MTFlag,
  CYFlag,
  MCFlag,
  SMFlag,
  VAFlag,
  ADFlag,
  LIFlag,
  KPFlag,
  IDFlag,
  THFlag,
  VNFlag,
  PHFlag,
  MYFlag,
  SGFlag,
  BNFlag,
  LAFlag,
  KHFlag,
  MMFlag,
  LKFlag,
  MVFlag,
  BTFlag,
  NPFlag,
  BDFlag,
  PKFlag,
  AFFlag,
  IRFlag,
  IQFlag,
  SYFlag,
  LBFlag,
  JOFlag,
  ILFlag,
  PSFlag,
  SAFlag,
  YEFlag,
  OMFlag,
  AEFlag,
  QAFlag,
  BHFlag,
  KWFlag,
  TRFlag,
  GEFlag,
  AMFlag,
  AZFlag,
  KZFlag,
  KGFlag,
  TJFlag,
  UZFlag,
  TMFlag,
  MNFlag,
  TWFlag,
  HKFlag,
  MOFlag,
  EGFlag,
  ETFlag,
  KEFlag,
  GHFlag,
  UGFlag,
  TNFlag,
  MAFlag,
  DZFlag,
  LYFlag,
  SDFlag,
  SSFlag,
  TZFlag,
  AOFlag,
  MZFlag,
  ZMFlag,
  ZWFlag,
  BWFlag,
  NAFlag,
  LSFlag,
  SZFlag,
  MWFlag,
  RWFlag,
  BIFlag,
  DJFlag,
  SOFlag,
  ERFlag,
  CDFlag,
  CGFlag,
  CFFlag,
  CMFlag,
  TDFlag,
  NEFlag,
  MLFlag,
  BFFlag,
  CIFlag,
  LRFlag,
  SLFlag,
  GNFlag,
  GWFlag,
  SNFlag,
  GMFlag,
  MRFlag,
  CVFlag,
  STFlag,
  GQFlag,
  GAFlag,
  MUFlag,
  SCFlag,
  KMFlag,
  MGFlag,
  NZFlag,
  FJFlag,
  PGFlag,
  SBFlag,
  VUFlag,
  NCFlag,
  PWFlag,
  MHFlag,
  FMFlag,
  NRFlag,
  KIFlag,
  TVFlag,
  TOFlag,
  WSFlag,
  CKFlag,
  NUFlag,
  PFFlag,
}
