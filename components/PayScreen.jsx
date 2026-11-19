"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CONFIG, inr, upiLink } from "../app/config";

export default function PayScreen({ amount, onBack, onPaid }) {
  const [copied, setCopied] = useState(false);
  const link = upiLink(amount);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <section className="pay">
      <p className="eyebrow">Final level</p>
      <h2 className="h2">Power up with {inr(amount)}</h2>
      <p className="sub pay-sub">
        On your phone, tap the button. On a laptop, scan the QR with any UPI app.
      </p>
      {/* Laptop-only (hidden below 1024px via CSS) */}
      <p className="sub pay-instr">Scan the QR with any UPI app on your phone.</p>
      <div className="upi-row pay-upi">
        <code>{CONFIG.upiId}</code>
        <button className="copy" onClick={copy}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <a className="btn btn-big btn-pay" href={link}>
        PAY {inr(amount)} NOW
      </a>
      <p className="hint">Opens GPay, PhonePe, Paytm or any UPI app</p>

      <div className="qr-card">
        <p className="qr-title">Or scan to pay</p>
        <div className="qr">
          <QRCodeSVG value={link} size={220} level="M" marginSize={2} />
        </div>
        <p className="qr-name">{CONFIG.fullName}</p>
        <div className="upi-row">
          <code>{CONFIG.upiId}</code>
          <button className="copy" onClick={copy}>
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className="qr-note">Check the name shows <b>{CONFIG.fullName}</b> before you pay.</p>
      </div>

      <button className="btn btn-big btn-done" onClick={onPaid}>
        I’VE PAID ✓
      </button>
      <button className="btn-link center" onClick={onBack}>
        ← Change amount
      </button>
    </section>
  );
}
