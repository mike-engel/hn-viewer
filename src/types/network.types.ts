export type NetworkState<D = any> = {
  loading: boolean;
  error: string | null;
  data: D | null;
};
