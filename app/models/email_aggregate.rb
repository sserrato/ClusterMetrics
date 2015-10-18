class EmailAggregate < ActiveRecord::Base
  MONTHNAMESMODEL = ["0","Jan","Feb","Mar", "Apr", "May", "Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  MINCONTACT = 4



  def self.red
    where(color: 'red')
  end

end
