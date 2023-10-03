// deno-lint-ignore-file no-namespace

export namespace FileUploader {
  export const max_file_upload_size = 100; // MB
  export const max_upload_image = 3; // MB
  export const allow_file_extension_image = [".jpg", ".jpeg", ".png"];
}

export const tables = {
  blocks: "blocks",
  settings: "settings",
  users: "users",
  user_address: "user_address", // users: one to many
  histories: "histories",
};

export const user_admin_testing = {
  username: "user_admin_testing",
  password: "wuenak@123Poolll",

  name: "Mamank Soto Babat",
};
export const user_customer_testing = {
  username: "user_customer_testing",
  password: "hanyaakuyangtau@123OK",

  name: "Jefri Herdi Triyanto",
};
