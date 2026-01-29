type Props = {
  title: string;
};

export const Cart: React.FC<Props> = ({ title }) => {
  return (
    <div className="card bg-base-100 shadow-md border border-base-300 p-4">
      <h4 className="font-semibold text-lg text-primary mb-1">{title}</h4>
      <p className="text-base-content/70">No items yet</p>
    </div>
  );
};
