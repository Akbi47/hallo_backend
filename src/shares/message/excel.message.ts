export const ERROR = {
  /*************************************** SERVICE INFO ***********************************************/
  // type_service
  TYPE_SERVICE_NOT_FOUND: 'loại dịch vụ không có trong file excel',
  TYPE_SERVICE_NOT_FOUND_IN_DB: 'loại dịch vụ không tìm thấy dữ liệu trong file database',

  // name service
  NAME_SERVICE_NOT_FOUND: 'tên dịch vụ không có trong file excel',
  CODE_SERVICE_NOT_FOUND_IN_DB: 'mã code sản phẩm dịch vụ không có trong database',

  // buy type
  BUY_TYPE_NOT_FOUND: 'gia hạn | thanh toán một lần không có trong file excel',
  BUY_TYPE_NOT_MATCH: `gia hạn | thanh toán một không hợp lệ`,

  // service_group
  SERVICE_GROUP_NOT_FOUND: 'tên nhóm dịch vụ không có trong file excel',
  SERVICE_GROUP_NOT_FOUND_IN_DB: 'tên nhóm dịch vụ không tìm thấy dữ liệu trong database',

  // service_group
  SERVICE_NOT_FOUND: 'tên  dịch vụ không có trong file excel',
  SERVICE_NOT_FOUND_IN_DB: 'tên dịch vụ không tìm thấy dữ liệu trong database',

  // capacity
  CAPACITY_NOT_FOUND: 'tên dung lượng không có trong file excel',
  CAPACITY_NOT_FOUND_IN_DB: 'tên dung lượng không tìm thấy dữ liệu trong database',

  // contract
  CONTRACT_NOT_FOUND: 'tên hợp đồng không có trong excel',
  CONTRACT_NOT_FOUND_IN_DB: 'tên hợp đồng không tìm thấy dữ liệu trong database',

  CLIENT_NOT_FOUND_IN_DB: 'tên khách hàng không tìm thấy dữ liệu trong database',
  PRODUCT_NOT_FOUND_IN_DB: 'tên sản phẩm ,dịch vu không tìm thấy dữ liệu trong database',

  DEVICE_NOT_FOUND_IN_DB: 'tên thiết bị không tìm thấy dữ liệu trong database',
  PAYMENT_METHOD_NOT_VALID: 'Phương thúc thanh toán không hợp hệ ',

  SHIPPING_METHOD_NOT_FOUND_IN_DB: 'tên phương thúc chuyển  hàng không tìm thấy dữ liệu trong database',

  // type_service_use
  TYPE_SERVICE_USE_NOT_FOUND: 'sử dụng cho không có trong file excel',
  TYPE_SERVICE_USE_NOT_FOUND_IN_DB: 'sử dụng cho không tìm thấy dữ liệu trong database',

  // supplier
  SUPPLIER_USE_NOT_FOUND: 'nhà cung cấp không tìm thấy dữ liệu  trong file excel',
  SUPPLIER_USE_NOT_FOUND_IN_DB: 'nhà cung cấp không tìm thấy dữ liệu trong database',

  // PRODUCER
  PRODUCER_USE_NOT_FOUND: 'nhà sản xuất không tìm thấy dữ liệu  trong file excel',
  PRODUCER_USE_NOT_FOUND_IN_DB: 'nhà sản xuất không tìm thấy dữ liệu trong database',

  // buying_fee
  BUYING_FEE_NOT_FOUND: 'cước nhập và quy đổi đơn vị không tìm thấy dữ liệu trong file excel',
  BUYING_FEE_NOT_FOUND_IN_DB: 'cước nhập và quy đổi đơn vị không tìm thấy dữ liệu trong database',
  BUYING_FEE_PRICE_NOT_FOUND: 'cước nhập và quy đổi cước không tìm thấy dữ liệu trong excel',

  // selling_fee
  SELLING_FEE_NOT_FOUND: 'cước bán và quy đổi đơn vị không tìm thấy dữ liệu trong file excel',
  SELLING_FEE_NOT_FOUND_IN_DB: 'cước bán và quy đổi đơn vị không tìm thấy dữ liệu trong database',
  SELLING_FEE_PRICE_NOT_FOUND: 'cước bán và quy đổi cước không tìm thấy dữ liệu trong file excel',

  // currency_unit_id
  CURRENCY_UNIT_NOT_FOUND: 'đơn vị tiền tệ không có trong file excel',
  CURRENCY_UNIT_NOT_FOUND_IN_DB: 'đơn vị tiền tệ không tìm thấy dữ liệu trong database',

  // currency_unit_id
  UNIT_NOT_FOUND: 'đơn vị cước bán không có trong file excel',
  UNIT_NOT_FOUND_IN_DB: 'đơn vị cước bán không tìm thấy dữ liệu trong database',

  // status
  STATUS_NOT_FOUND: 'trạng thái không có trong file excel',
  STATUS_INVALID: `trạng thái không hợp lệ `,

  /*************************************** PRODUCT INFO ***********************************************/
  // type_product
  TYPE_PRODUCT_NOT_FOUND: 'loại sản phẩm không có trong file excel',
  TYPE_PRODUCT_NOT_FOUND_IN_DB: 'loại sản phẩm không tìm thấy dữ liệu trong file database',

  // name service
  NAME_PRODUCT_INFO_NOT_FOUND: 'tên thông tin sản phẩm không có trong file excel',

  // product_info_group
  PRODUCT_INFO_GROUP_NOT_FOUND: 'tên nhóm dịch vụ thông tin sản phẩm không có trong file excel',
  PRODUCT_INFO_NOT_FOUND_IN_DB: 'tên nhóm dịch vụ thông tin sản phẩm không tìm thấy dữ liệu trong database',
  PRODUCT_INFO_CODE_NOT_FOUND_IN_DB: 'mã code sản phẩm không tìm thấy dữ liệu trong database',

  // type_product_info_use
  TYPE_PRODUCT_INFO_USE_NOT_FOUND: 'kiểu sử dụng cho của thông tin sản phẩm không có trong file excel',
  TYPE_PRODUCT_INFO_USE_NOT_FOUND_IN_DB:
    'kiểu sử dụng cho của thông tin sản phẩm không tìm thấy dữ liệu trong database',

  // selling_exchanges
  SELLING_EXCHANGES_INVALID: 'quy đổi giá bán không hợp lệ',
  SELLING_EXCHANGES_UNIT_NOT_FOUND_IN_DB: 'đơn vị trong quy đổi giá bán không tìm thấy trong database',
  SELLING_EXCHANGES_TYPE_INVALID: 'kiểu quy đổi trong quy đổi giá bán không hợp lệ, các kiểu quy đổi > < = >= <=',

  /***************************************** PRODUCT *************************************************/

  // PRODUCER
  PRODUCER_NOT_FOUND: 'nhà sản xuất không tìm thấy dữ liệu trong file excel',
  PRODUCER_NOT_FOUND_IN_DB: 'nhà sản xuất không tìm thấy dữ liệu trong database',

  // CODE
  CODE_NOT_FOUND: 'mã sản phẩm không có trong file excel',
  CODE_NOT_FOUND_IN_DB: 'mã sản phẩm không tìm thấy dữ liệu trong database',

  // SUPPLIER
  SUPPLIER_NOT_FOUND: 'nhà cung cấp không tìm thấy dữ liệu trong file excel',
  SUPPLIER_NOT_FOUND_IN_DB: 'mã nhà cung cấp trong mã sản phẩm không tìm thấy dữ liệu trong database',

  // BUYING_FEE_UNIT_ID
  BUYING_FEE_UNIT_ID_NOT_FOUND: 'đơn vị trong giá nhập không có trong file excel',
  BUYING_FEE_UNIT_ID_NOT_FOUND_IN_DB: 'đơn vị trong giá nhập không tìm thấy dữ liệu trong database',

  // DATE
  DATE_INVALID: 'định dạng kiểu ngày tháng năm không không hợp lệ',
  DATE_IS_EMPTY: 'định dạng kiểu ngày đang để trống',

  // IMPORT_DATE
  IMPORT_DATE_NOT_FOUND: 'đơn vị trong giá nhập không có trong file excel',
  IMPORT_DATE_NOT_FOUND_IN_DB: 'đơn vị trong giá nhập không tìm thấy dữ liệu trong database',

  /**********************************************SUPPLIER******************************************* */
  // type
  TYPE_NOT_FOUND: 'loại sản phẩm - dịch vụ không tìm thấy trong file excel',
  TYPE_NOT_IN_DB: `loại sản phẩm - dịch vụ không tìm thấy trong database`,
};
