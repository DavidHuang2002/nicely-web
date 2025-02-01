output "bucket_name" {
  value = aws_s3_bucket.audio_uploads.id
}

output "access_key_id" {
  value     = aws_iam_access_key.app_user.id
  sensitive = true
}

output "secret_access_key" {
  value     = aws_iam_access_key.app_user.secret
  sensitive = true
}