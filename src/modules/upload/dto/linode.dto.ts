export interface LinodeConfigDto {
  upload_path: string;
  access_key_id: string;
  secret_access_key: string;
  bucket_name: string;
  region: string;
  domain: string;
  upload_limit: number;
  base_url: string;
}
