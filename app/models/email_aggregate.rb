class EmailAggregate < ActiveRecord::Base
  #EmailAggregate::MONTHNAMESMODEL to use constants, constants declared here:
  MONTHNAMESMODEL = ["0","Jan","Feb","Mar", "Apr", "May", "Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  MONTHVALUESMODEL =  [1,2,3,4,5,6,7,8,9,10,11,12]
  MINCONTACT = 4
  BRIDGENAMESMODEL = ['Not Yet Classified','Capital','Company','Research','Public Sector', 'Cluster','Global Market','Education','Junk']
  BRIDGEVALUEMODEL = [0, 1, 2,3,4,5,6,7,9998,9999]


  #bridge filter removes non-essential bridges (junk, misc and non-categorized from the charting queries)
  scope :bridge_filter, lambda{ where("category <> '9999' AND category <> 9998 AND category <> '0'")}
  # groups by moonth and orders by month the sum of freqencies.
  scope :gr_month_or_month_su_frequency, lambda{ group('month').order('month ASC').sum('frequency')}

  #groups and orders by category bridge the total frequency
  scope :gr_category_or_category_su_frequency, lambda{ group('category').order('category ASC').sum('frequency')}

  #averages
  scope :gr_category_or_category_av_frequency, lambda{ group('category').order('category ASC').average('frequency')}
  scope :gr_month_or_month_av_frequency, lambda{ group('month').order('month ASC').average('frequency')}
  def self.red
    where(color: 'red')
  end

end
