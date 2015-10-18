class CreateClusterClientGoals < ActiveRecord::Migration
  def change
    create_table :cluster_client_goals do |t|
      t.integer :frequencyGoal
      t.integer :diversityGoal
      t.integer :bridge
      t.integer :bridgeGlobal
      t.integer :year

      t.timestamps null: false
    end
  end
end
