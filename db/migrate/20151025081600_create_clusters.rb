class CreateClusters < ActiveRecord::Migration
  def change
    create_table :clusters do |t|
      t.text :clusterName

      t.timestamps null: false
    end
  end
end
