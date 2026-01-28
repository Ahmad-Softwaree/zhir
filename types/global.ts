export type GlobalFormProps = {
  state?: "update" | "insert";
  onFinalClose?: () => void;
};

export type DataTypes = any;

declare global {
  var mongoose: {
    conn: typeof import("mongoose") | null;
    promise: Promise<typeof import("mongoose")> | null;
  };
}
