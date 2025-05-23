// ----------------------------------------------------------------------

export type IProduceTableFilters = {
  query: string;
  origin: string[];
  status: string;
};

export type IProduceItem = {
  id: string;
  item_no: string;
  common_name: string;
  origin: string;
  size: string;
  weight: string | null;
  weight_unit: string;
  scientific_name: string;
  package_type: string;
  status: string;
};
