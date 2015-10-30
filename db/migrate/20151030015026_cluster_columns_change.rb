class ClusterColumnsChange < ActiveRecord::Migration
  def change
    change_table :clusters do |t|
      t.rename :clusterName, :cluster_name
    end
  end
end
