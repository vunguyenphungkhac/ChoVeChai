"use client";

import { useState } from "react";
import { Camera, ImagePlus, ChevronDown, CheckCircle2, Info, X, ChevronRight } from "lucide-react";

const SELL_CATEGORIES = [
  "Điện tử & Công nghệ",
  "Thời trang & Phụ kiện",
  "Nội thất & Gia dụng",
  "Xe cộ & Phụ tùng",
  "Sách & Học liệu",
  "Thể thao & Dã ngoại",
  "Đồ chơi & Trẻ em",
  "Mỹ phẩm & Sức khỏe",
  "Khác",
];

const CONDITIONS: { value: string; label: string; desc: string; activeClass: string }[] = [
  { value: "New",       label: "Mới",        desc: "Chưa qua sử dụng",     activeClass: "border-success bg-success-soft text-success"       },
  { value: "Like New",  label: "Như mới",    desc: "Dùng ít, còn rất đẹp", activeClass: "border-primary bg-brand-soft text-primary"         },
  { value: "Good",      label: "Tốt",        desc: "Có dấu hiệu sử dụng",  activeClass: "border-pi-gold bg-pi-gold-soft text-pi-gold"       },
  { value: "Fair",      label: "Trung bình", desc: "Hao mòn rõ ràng",      activeClass: "border-border bg-secondary text-muted-foreground"  },
];

// 3-step header steps
const FORM_STEPS = [
  { n: 1, label: "Thông tin" },
  { n: 2, label: "Giá & DM"  },
  { n: 3, label: "Đăng tin"  },
];

function FormStepHeader({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-3">
      {FORM_STEPS.map((step, idx) => {
        const done   = step.n < currentStep;
        const active = step.n === currentStep;
        const isLast = idx === FORM_STEPS.length - 1;

        return (
          <div key={step.n} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  done
                    ? "bg-success text-success-foreground"
                    : active
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-border text-muted-foreground"
                }`}
              >
                {done ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.n
                )}
              </div>
              <span className={`text-[9px] font-semibold whitespace-nowrap ${active ? "text-primary" : done ? "text-success" : "text-muted-foreground"}`}>
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div className="flex-1 h-0.5 mx-2 mb-3 rounded-full overflow-hidden bg-border">
                <div className={`h-full bg-primary transition-all duration-500 ${done ? "w-full" : "w-0"}`} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Determine which form step we're on based on filled fields
function deriveStep(title: string, price: string, category: string, condition: string): number {
  if (!title.trim()) return 1;
  if (!price || !category) return 2;
  return 3;
}

export function SellTab() {
  const [title,         setTitle]         = useState("");
  const [description,   setDescription]   = useState("");
  const [price,         setPrice]         = useState("");
  const [category,      setCategory]      = useState("");
  const [condition,     setCondition]     = useState("");
  const [location,      setLocation]      = useState("");
  const [showCatPicker, setShowCatPicker] = useState(false);
  const [isSubmitting,  setIsSubmitting]  = useState(false);
  const [submitted,     setSubmitted]     = useState(false);

  const canSubmit = title.trim() && price && Number(price) > 0 && category && condition && location.trim();
  const currentStep = deriveStep(title, price, category, condition);

  async function handleSubmit() {
    if (!canSubmit) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1800));
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTitle(""); setDescription(""); setPrice("");
      setCategory(""); setCondition(""); setLocation("");
    }, 4000);
  }

  /* Success state */
  if (submitted) {
    return (
      <div className="flex flex-col min-h-full bg-surface-1 items-center justify-center px-6 pb-24">
        <div className="w-20 h-20 rounded-3xl bg-success-soft flex items-center justify-center mb-5 shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-success" strokeWidth={1.75} />
        </div>
        <h2 className="text-2xl font-black text-foreground mb-2 text-center tracking-tight">
          Tin đã được đăng!
        </h2>
        <p className="text-sm text-muted-foreground text-center leading-relaxed max-w-xs mb-6">
          Sản phẩm đang hiển thị trên ChoVeChai. Người mua có thể thanh toán bằng{" "}
          <span className="font-bold text-primary">Pi</span>.
        </p>
        <div className="w-full px-4 py-3.5 rounded-2xl bg-brand-soft border border-primary/20 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-black text-lg leading-none">π</span>
          </div>
          <p className="text-xs font-semibold text-foreground">
            Nhận thanh toán Pi trực tiếp vào ví của bạn
          </p>
        </div>
      </div>
    );
  }

  /* Form */
  return (
    <div className="flex flex-col bg-surface-1 overflow-y-auto no-scrollbar pb-nav">

      {/* Header */}
      <header className="bg-primary px-4 pt-11 pb-5">
        <h1 className="text-primary-foreground text-[1.65rem] font-black tracking-tight">Đăng bán</h1>
        <p className="text-primary-foreground/60 text-xs mt-1 font-medium">
          Liệt kê sản phẩm và nhận thanh toán bằng Pi
        </p>
      </header>

      {/* Step progress */}
      <div className="bg-card border-b border-border">
        <FormStepHeader currentStep={currentStep} />
      </div>

      <div className="px-4 pt-5 space-y-5">

        {/* Photos */}
        <div>
          <p className="text-sm font-black text-foreground mb-2">
            Ảnh sản phẩm <span className="text-destructive">*</span>
          </p>
          <div className="flex gap-2.5">
            <button className="w-[4.5rem] h-[4.5rem] rounded-2xl border-2 border-dashed border-primary bg-brand-soft flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform shrink-0">
              <Camera className="w-5 h-5 text-primary" strokeWidth={1.75} />
              <span className="text-[9px] text-primary font-bold">Chụp</span>
            </button>
            {[1, 2, 3].map((i) => (
              <button
                key={i}
                className="flex-1 h-[4.5rem] rounded-2xl border-2 border-dashed border-border bg-surface-3 flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform"
              >
                <ImagePlus className="w-4 h-4 text-muted-foreground" strokeWidth={1.75} />
                <span className="text-[9px] text-muted-foreground font-medium">Thêm ảnh</span>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1.5 px-1">Tối đa 5 ảnh · Ảnh đầu là ảnh bìa</p>
        </div>

        {/* Title */}
        <div>
          <label className="text-sm font-black text-foreground block mb-1.5">
            Tiêu đề <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            placeholder="VD: iPhone 14 Pro Max 256GB, màu đen..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
            className="w-full bg-card border border-border rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-[11px] text-muted-foreground mt-1 px-1 flex justify-between">
            <span>Tiêu đề rõ ràng giúp dễ bán hơn</span>
            <span className={title.length > 60 ? "text-pi-gold font-semibold" : ""}>{title.length}/80</span>
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-black text-foreground block mb-1.5">Mô tả chi tiết</label>
          <textarea
            placeholder="Mô tả tình trạng, xuất xứ, phụ kiện đi kèm, lý do bán... Càng chi tiết càng dễ bán!"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full bg-card border border-border rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none leading-relaxed"
          />
        </div>

        {/* Price */}
        <div>
          <label className="text-sm font-black text-foreground block mb-1.5">
            Giá bán <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black text-xl leading-none select-none">
              π
            </span>
            <input
              type="number"
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="1"
              className="w-full bg-card border border-border rounded-2xl pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {price && Number(price) > 0 && (
            <div className="flex items-center gap-1.5 mt-1.5 px-1">
              <Info className="w-3 h-3 text-muted-foreground shrink-0" />
              <p className="text-[11px] text-muted-foreground">
                Người mua trả{" "}
                <span className="font-bold text-primary">{Number(price).toLocaleString()} π</span>
                {" "}· phí nền tảng 2% = bạn nhận{" "}
                <span className="font-bold text-success">{(Number(price) * 0.98).toFixed(1)} π</span>
              </p>
            </div>
          )}
        </div>

        {/* Category */}
        <div className="relative">
          <label className="text-sm font-black text-foreground block mb-1.5">
            Danh mục <span className="text-destructive">*</span>
          </label>
          <button
            onClick={() => setShowCatPicker((v) => !v)}
            className={`w-full bg-card border rounded-2xl px-4 py-3 text-sm text-left flex items-center justify-between focus:outline-none transition-colors ${
              showCatPicker ? "border-primary ring-2 ring-ring" : "border-border"
            }`}
          >
            <span className={category ? "text-foreground font-semibold" : "text-muted-foreground"}>
              {category || "Chọn danh mục phù hợp"}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${showCatPicker ? "rotate-180" : ""}`}
            />
          </button>
          {showCatPicker && (
            <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
              <div className="max-h-52 overflow-y-auto no-scrollbar">
                {SELL_CATEGORIES.map((cat, i) => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setShowCatPicker(false); }}
                    className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-colors ${
                      i < SELL_CATEGORIES.length - 1 ? "border-b border-border" : ""
                    } ${category === cat ? "bg-brand-soft text-primary font-semibold" : "text-foreground active:bg-secondary"}`}
                  >
                    {cat}
                    {category === cat && (
                      <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Condition */}
        <div>
          <label className="text-sm font-black text-foreground block mb-2">
            Tình trạng <span className="text-destructive">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CONDITIONS.map((cond) => {
              const isSelected = condition === cond.value;
              return (
                <button
                  key={cond.value}
                  onClick={() => setCondition(cond.value)}
                  className={`p-3 rounded-2xl border-2 text-left transition-all active:scale-95 ${
                    isSelected ? cond.activeClass : "bg-card border-border"
                  }`}
                >
                  <p className={`text-sm font-bold ${isSelected ? "" : "text-foreground"}`}>{cond.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{cond.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-black text-foreground block mb-1.5">
            Địa điểm giao dịch <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="VD: Quận 1, TP.HCM"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-card border border-border rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {location && (
              <button
                onClick={() => setLocation("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-muted flex items-center justify-center"
              >
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Pi payment banner */}
        <div className="flex items-start gap-3 bg-brand-soft rounded-2xl p-3.5 border border-primary/15">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-primary-foreground font-black text-lg leading-none">π</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground">Thanh toán qua Pi Network</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
              Pi được giữ trong escrow cho đến khi người mua xác nhận. An toàn và minh bạch 100%.
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-base shadow-lg shadow-primary/25 disabled:opacity-40 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Đang đăng tin...
            </>
          ) : (
            "Đăng tin ngay"
          )}
        </button>

        <p className="text-xs text-muted-foreground text-center pb-2">
          Bằng cách đăng tin bạn đồng ý với{" "}
          <span className="text-primary font-semibold">Điều khoản dịch vụ</span> ChoVeChai
        </p>
      </div>
    </div>
  );
}
