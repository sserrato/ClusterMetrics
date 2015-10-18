class CreateClusterClients < ActiveRecord::Migration
  def change
    create_table :cluster_clients do |t|
      t.string :name

      t.timestamps null: false
    end
  end
end
