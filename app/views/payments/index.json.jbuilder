json.array!(@payments) do |payment|
  json.extract! payment, :id, :token
  json.url payment_url(payment, format: :json)
end
