import mongoose, {
  Document,
  InferSchemaType,
  model,
  Schema,
} from "npm:mongoose@^6.7";
const Types = mongoose.Schema.Types;

export enum TransactionStatus {
  // positive case...
  PENDING_PAYMENT = "PENDING_PAYMENT", // menunggu pembayaran, auto reject jika lebih dari 24 jam
  PENDING_APPROVAL = "PENDING_APPROVAL", // merchant check mutasi apakah customer benar-benar membayar dari bukti pembayaran yang sudah dikirim
  ON_PROCESS = "ON_PROCESS", // sudah di bayar, menunggu pengemasan / sedang di order product nya
  ON_THE_WAY = "ON_THE_WAY", // pesanan di kirim
  ARRIVED = "ARRIVED", // pesanan telah tiba
  SUCCESS = "SUCCESS", // pesanan tidak ada komplain dari customer dan mengakhiri transaksi
  // negative case...
  RETURN = "RETURN", // setelah tiba, produk mengalami kerusakan atau kecacatan, jika barang sudah ditangan merchant maka status harus berubah menjadi ON_PROCESS
  CANCELED = "CANCELED", // cancel dari customer atau di cancel oleh merchant
  VALIDATION = "VALIDATION", // ketika terjadi gangguan pada bank
  REJECT = "REJECT", // bukti transfer salah (3x kesempatan)
}

const TransactionSchema = new Schema(
  {
    customer: {
      type: Types.String,
      ref: "User",
      required: true,
    },
    bank: {
      type: Types.String,
      ref: "Bank",
      required: true,
    },
    invoice: { type: Types.String, required: true },

    products: [
      {
        product: {
          type: Types.String,
          ref: "Product",
          required: true,
        },
        orderQuantity: {
          type: Types.Number,
          default: 1,
        },
        lastWeightGram: {
          type: Types.Number,
          default: 1,
        },
        lastPrice: {
          type: Types.Number,
          default: 0,
        },
        lastDiscountPrice: {
          type: Types.Number,
          default: 0,
        },
      },
    ],

    status: [
      {
        key: {
          type: Types.String,
          enum: Object.values(TransactionStatus),
          required: true,
        },
        name: { type: Types.String, required: true },
        list: [
          // TODO: tolong lihat lagi format dari raja ongkir...
          {
            deliveredStatus: { type: Types.String },
          },
        ],
        createdAt: { type: Types.Date, default: Date.now() },
      },
    ],

    proof_payment: [
      {
        filename: { type: Types.String, required: true },
        isPending: { type: Types.Boolean, default: false },
        isOriginal: { type: Types.Boolean },
      },
    ],

    // RAJA ONGKIR MANAGEMENT
    deliveryCode: { type: Types.String }, // resi
    subdistrictFrom: { type: Types.String }, // merchant address
    subdistrictTo: { type: Types.String }, // customer address
  },
  {
    timestamps: true,
    collection: "transactions",
  }
);

export type Transaction = InferSchemaType<typeof TransactionSchema> & Document;
const TransactionModel = model<Transaction>("Transaction", TransactionSchema);
export default TransactionModel;
