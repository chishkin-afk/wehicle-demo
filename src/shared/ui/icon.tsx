"use client";
import {
  ChartBar,
  CalendarBlank,
  Users,
  Wrench,
  Garage,
  GearSix,
  ArrowUpRight,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  Bell,
  CaretDown,
  CaretLeft,
  CaretRight,
  MagnifyingGlass,
  Clock,
  Check,
  Car,
  Drop,
  Cpu,
  Tire,
  Disc,
  Snowflake,
  Engine,
  DotsThree,
  Export,
  MapPin,
  Phone,
  EnvelopeSimple,
  CheckCircle,
  ShieldCheck,
  SignOut,
  List,
  PaperPlaneTilt,
  LinkSimple,
  WarningCircle,
  Copy,
  User,
  Buildings,
  Gauge,
  Lightning,
  Star,
} from "@phosphor-icons/react";
const icons = {
  chart: ChartBar,
  calendar: CalendarBlank,
  users: Users,
  wrench: Wrench,
  garage: Garage,
  settings: GearSix,
  up: ArrowUpRight,
  down: ArrowDown,
  right: ArrowRight,
  left: ArrowLeft,
  plus: Plus,
  close: X,
  bell: Bell,
  chevron: CaretDown,
  previous: CaretLeft,
  next: CaretRight,
  search: MagnifyingGlass,
  clock: Clock,
  check: Check,
  car: Car,
  oil: Drop,
  diagnostic: Cpu,
  tire: Tire,
  brake: Disc,
  air: Snowflake,
  engine: Engine,
  more: DotsThree,
  export: Export,
  pin: MapPin,
  phone: Phone,
  email: EnvelopeSimple,
  success: CheckCircle,
  shield: ShieldCheck,
  logout: SignOut,
  menu: List,
  telegram: PaperPlaneTilt,
  link: LinkSimple,
  warning: WarningCircle,
  copy: Copy,
  user: User,
  business: Buildings,
  gauge: Gauge,
  lightning: Lightning,
  star: Star,
};
export type IconName = keyof typeof icons;
export function Icon({
  name,
  size = 20,
  weight = "regular",
  className,
}: {
  name: IconName;
  size?: number;
  weight?: "regular" | "bold" | "fill" | "light";
  className?: string;
}) {
  const Component = icons[name];
  return (
    <Component
      size={size}
      weight={weight}
      className={className}
      aria-hidden='true'
    />
  );
}
