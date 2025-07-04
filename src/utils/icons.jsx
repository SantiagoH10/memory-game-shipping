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

const USFlag = createFlagComponent('US')
const CAFlag = createFlagComponent('CA')
const GBFlag = createFlagComponent('GB')
const FRFlag = createFlagComponent('FR')
const DEFlag = createFlagComponent('DE')
const ITFlag = createFlagComponent('IT')
const ESFlag = createFlagComponent('ES')
const JPFlag = createFlagComponent('JP')
const CNFlag = createFlagComponent('CN')
const INFlag = createFlagComponent('IN')
const BRFlag = createFlagComponent('BR')
const AUFlag = createFlagComponent('AU')
const MXFlag = createFlagComponent('MX')
const RUFlag = createFlagComponent('RU')
const KRFlag = createFlagComponent('KR')
const NGFlag = createFlagComponent('NG')
const ARFlag = createFlagComponent('AR')
const ZAFlag = createFlagComponent('ZA')
const NLFlag = createFlagComponent('NL')
const SEFlag = createFlagComponent('SE')

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
}
