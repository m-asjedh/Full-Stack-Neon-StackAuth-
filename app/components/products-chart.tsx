interface ChartData {
  week: string;
  products: number;
}

export default function ProductsChart({ data }: { data: ChartData[] }) {
  return (
    <div>
      <h1>Products Chart</h1>
    </div>
  );
}
