import React from "react";

export interface ShippingInfo {
  fullName: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  shippingType: string;
}

interface Props {
  value: ShippingInfo;
  onChange: (v: ShippingInfo) => void;
}

const ShippingForm: React.FC<Props> = ({ value, onChange }) => {
  const update = (patch: Partial<ShippingInfo>) => onChange({ ...value, ...patch });

  return (
    <div className="p-3 border rounded space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input className="input input-sm input-bordered" placeholder="Full name" value={value.fullName} onChange={(e) => update({ fullName: e.target.value })} />
        <input className="input input-sm input-bordered" placeholder="Phone (optional)" value={value.phone ?? ""} onChange={(e) => update({ phone: e.target.value })} />
      </div>

      <input className="input input-sm input-bordered w-full" placeholder="Address line 1" value={value.address1} onChange={(e) => update({ address1: e.target.value })} />
      <input className="input input-sm input-bordered w-full" placeholder="Address line 2 (optional)" value={value.address2 ?? ""} onChange={(e) => update({ address2: e.target.value })} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input className="input input-sm input-bordered" placeholder="City" value={value.city} onChange={(e) => update({ city: e.target.value })} />
        <input className="input input-sm input-bordered" placeholder="State/Region" value={value.state ?? ""} onChange={(e) => update({ state: e.target.value })} />
        <input className="input input-sm input-bordered" placeholder="Postal code" value={value.postalCode} onChange={(e) => update({ postalCode: e.target.value })} />
      </div>

      <div className="flex items-center gap-2">
        <input className="input input-sm input-bordered" placeholder="Country" value={value.country} onChange={(e) => update({ country: e.target.value })} />
        <select className="select select-sm ml-2" value={value.shippingType} onChange={(e) => update({ shippingType: e.target.value })}>
          <option value="standard">Standard Shipping</option>
          <option value="express">Express Shipping</option>
        </select>
      </div>
    </div>
  );
};

export default ShippingForm;
