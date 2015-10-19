class EmailAggregate < ActiveRecord::Base
  #EmailAggregate::MONTHNAMESMODEL to use constants
  MONTHNAMESMODEL = ["0","Jan","Feb","Mar", "Apr", "May", "Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  MONTHVALUESMODEL =  [1,2,3,4,5,6,7,8,9,10,11,12]
  MINCONTACT = 4
  BRIDGENAMESMODEL = ['Not Yet Classified','Capital','Company','Research','Public Sector', 'Cluster','Global Market','Education','Junk']
  BRIDGEVALUEMODEL = [0, 1, 2,3,4,5,6,7,9998,9999]


  def self.red
    where(color: 'red')
  end

end
