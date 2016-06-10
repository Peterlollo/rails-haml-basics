class CreatePayments < ActiveRecord::Migration
  def change
    create_table :payments do |t|
      t.string :token

      t.timestamps null: false
    end
  end
end
