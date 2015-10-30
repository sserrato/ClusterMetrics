class EmailColumnsChange < ActiveRecord::Migration
  def change
    change_table :emails do |t|
      t.rename :bridgeGlobal, :bridge_global
      t.rename :emailFrequency, :email_frequency

    end
  end
end
