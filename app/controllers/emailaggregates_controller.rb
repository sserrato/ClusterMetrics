class EmailaggregatesController < ApplicationController
  def norms
  end

  def diversity
    @monthDistinctDomain = EmailAggregate.select("month").group('domain').distinct.count
    @distinctDomainCountCount = EmailAggregate.select("domain").distinct.where("category <> '9999' AND category <> '9998' AND frequency > 4").group('month').group('category').count
    @clusterGoals = ClusterClientGoal.all
    @divGoalBrige1 = ClusterClientGoal.select("bridge").where("bridge='1'").sum("diversityGoal")

    @distinctCat1ByMonth = EmailAggregate.select("domain").distinct.where("category = '1' AND category <> '9999' AND category <> '9998' AND frequency > 4").group('month').order('month ASC').count

    @distinctCat2ByMonth = EmailAggregate.select("domain").distinct.where("category = '2' AND category <> '9999' AND category <> '9998' AND frequency > 4").group('month').order('month ASC').count
    @distinctCat3ByMonth = EmailAggregate.select("domain").distinct.where("category = '3' AND category <> '9999' AND category <> '9998' AND frequency > 4").group('month').order('month ASC').count
    @distinctCat4ByMonth = EmailAggregate.select("domain").distinct.where("category = '4' AND category <> '9999' AND category <> '9998' AND frequency > 4").group('month').order('month ASC').count
    @distinctCat5ByMonth = EmailAggregate.select("domain").distinct.where("category = '5' AND category <> '9999' AND category <> '9998' AND frequency > 4").group('month').order('month ASC').count
    @distinctCat6ByMonth = EmailAggregate.select("domain").distinct.where("category = '6' AND category <> '9999' AND category <> '9998' AND frequency > 4").group('month').order('month ASC').count
    @distinctCat7ByMonth = EmailAggregate.select("domain").distinct.where("category = '7' AND category <> '9999' AND category <> '9998' AND frequency > 4").group('month').order('month ASC').count

  end

  def intensity

      @clusterGoals = ClusterClientGoal.all
      @freqGoalModel = ClusterClientGoal.where("bridge <> '9999' AND bridge <> '9998' AND bridge<> '0'").group('bridge').order('bridge ASC').sum('frequencyGoal')
      @freqGoalModel = ClusterClientGoal.where("bridge <> '9999' AND bridge <> '9998' AND bridge<> '0'").group('bridge').order('bridge ASC').sum('frequencyGoal')
  end

  def dashboard
  end

  def new

  end


  def lHighCharts
    @chartOrg = LazyHighCharts::HighChart.new('graph') do |f|
      f.title(:text => "Population vs GDP For 5 Big Countries [2009]")
      f.xAxis(:categories => ["United $$tates", "Japan", "China", "Germany", "France"])
      f.series(:name => "GDP in Billions", :yAxis => 0, :data => [14119, 5068, 4985, 3339, 2656])
      f.series(:name => "Population in Millions", :yAxis => 1, :data => [310, 127, 1340, 81, 65])

      f.yAxis [
        {:title => {:text => "GDP in Billions", :margin => 70} },
        {:title => {:text => "Population in Millions"}, :opposite => true},
      ]

      f.legend(:align => 'right', :verticalAlign => 'top', :y => 75, :x => -50, :layout => 'vertical',)
      f.chart({:defaultSeriesType=>"column"})
    end

  end


  def index
    @emails = EmailAggregate.all.order('frequency DESC').limit(100).where("category <> '9999' AND category <> '9998' AND frequency > 4")
    @bridges = [0, 1, 2,3,4,5,6,7,9998,9999]
    @bridgeNames = ['Not Yet Classified','Capital','Company','Research','Public Sector', 'Cluster','Global Market','Education','Junk']
    @bridgeNamesHash = {}
    @bridges.each do |bridge|
      @bridgeNamesHash[bridge] = @bridgeNames[bridge]
    end


    # Specifies the minimum contact parameter to include data in the analysis. It is 4 contats within a month reporting period.
    @minContact = 4
    @bridgeContactAnnualTotal = {}
    @domainsUnique = {}
    #Total Annual Contact with Bridge
    @bridges.each do |bridge|
      @bridgeContactAnnualTotal[bridge] = EmailAggregate.where("category = '?'", bridge).group('month').order('month ASC').sum('frequency')
    end

    @totalCategory0 = EmailAggregate.where("category = '0'").sum('frequency')
    @totalCategory1 = EmailAggregate.where("category = '1'").sum('frequency')
    @totalCategory2 = EmailAggregate.where("category = '2'").sum('frequency')
    @totalCategory3 = EmailAggregate.where("category = '3'").sum('frequency')
    @totalCategory4 = EmailAggregate.where("category = '4'").sum('frequency')
    @totalCategory5 = EmailAggregate.where("category = '5'").sum('frequency')
    @totalCategory6 = EmailAggregate.where("category = '6'").sum('frequency')
    @totalCategory7 = EmailAggregate.where("category = '7'").sum('frequency')
    #below hashes return months of data, using @minContact variable to specifiy minimum frequency of contact on a monthly basis to factor in the analysis. It may be interesting to put more variability.
    @monthContacts = {}
    @months = [1,2,3,4,5,6,7,8,9,10,11,12]
    @monthNames = ["Jan","Feb","Mar", "Apr", "May", "Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    @months.each do |month|
    @monthContacts[month] = EmailAggregate.where("month = '?'", month).where("category <> '9999' AND category <> '9998'AND category <> '0'").where("frequency > ?", @minContact).group('category').order('category ASC').sum('frequency')
    end

    @monthContactsJan = EmailAggregate.where("month = '1'").where("category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency > ?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsFeb = EmailAggregate.where("month = '2' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency > ?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsMar = EmailAggregate.where("month = '3' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency > ?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsApr = EmailAggregate.where("month = '4' AND category <> '9999' AND category <> '9998'AND category<> '0' ").where("frequency > ?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsMay = EmailAggregate.where("month = '5' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency > ?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsJun = EmailAggregate.where("month = '6' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency > ?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsJul = EmailAggregate.where("month = '7' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency > ?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsAug = EmailAggregate.where("month = '8' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency > ?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsSep = EmailAggregate.where("month = '9' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency > ?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsOct = EmailAggregate.where("month = '10' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency > ?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsNov = EmailAggregate.where("month = '11' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency > ?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsDec = EmailAggregate.where("month = '12' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency > ?", @minContact).group('category').order('category ASC').sum('frequency')

    @totalCategory0byMonth = EmailAggregate.where("category = '0'").group('month').order('month ASC').sum('frequency')
    @totalCategory1byMonth = EmailAggregate.where("category = '1'").group('month').order('month ASC').sum('frequency')
    @totalCategory2byMonth = EmailAggregate.where("category = '2'").group('month').order('month ASC').sum('frequency')
    @totalCategory3byMonth = EmailAggregate.where("category = '3'").group('month').order('month ASC').sum('frequency')
    @totalCategory4byMonth = EmailAggregate.where("category = '4'").group('month').order('month ASC').sum('frequency')
    @totalCategory5byMonth = EmailAggregate.where("category = '5'").group('month').order('month ASC').sum('frequency')
    @totalCategory6byMonth = EmailAggregate.where("category = '6'").group('month').order('month ASC').sum('frequency')
    @totalCategory7byMonth = EmailAggregate.where("category = '7'").group('month').order('month ASC').sum('frequency')
    @domainCount = EmailAggregate.group('domain').sum('frequency')

    @distinctDomainCount1 = EmailAggregate.select("domain").distinct.count
    @distinctDomainCount2 = EmailAggregate.select("domain, category").distinct.where("category <> '9999' AND category <> '9998' AND frequency > 4").order('category ASC')
    @distinctDomainCount3 = EmailAggregate.select("domain").distinct.where("category <> '9999' AND category <> '9998' AND frequency > 4").count
    @distinctDomain = EmailAggregate.select("domain").distinct[1]
    @distinctDomainCountByMonth = EmailAggregate.all.select("domain").group('month').order('month ASC').sum('frequency')
    @totalContactsbyMonth= EmailAggregate.all.group('month').order('month ASC').sum('frequency')


    @chart = LazyHighCharts::HighChart.new('graph') do |f|
      f.title(:text => "Total # Contacts Per Month across Categories")
      f.xAxis(:categories =>  @bridgeNames)
      f.series(:name => "January", :yAxis => 1, :data => @monthContactsJan.map)
      f.series(:name => "February", :yAxis => 1, :data => @monthContactsFeb.map)
      f.series(:name => "March", :yAxis => 1, :data => @monthContactsMar.map)
      f.series(:name => "April", :yAxis => 1, :data => @monthContactsApr.map)
      f.series(:name => "May", :yAxis => 1, :data => @monthContactsMay.map)
      f.series(:name => "June", :yAxis => 1, :data => @monthContactsJun.map)
      f.series(:name => "July", :yAxis => 1, :data => @monthContactsJul.map)
      f.series(:name => "August", :yAxis => 1, :data => @monthContactsAug.map)
      f.series(:name => "September", :yAxis => 1, :data => @monthContactsSep.map)
      f.series(:name => "October", :yAxis => 1, :data => @monthContactsOct.map)
      f.series(:name => "November", :yAxis => 1, :data => @monthContactsNov.map)
      f.series(:name => "December", :yAxis => 1, :data => @monthContactsDec.map)

      f.yAxis [
        {:title => {:text => "", :margin => 0} },
        {:title => {:text => ""}, :opposite => true},
      ]

      f.legend(:align => 'right', :verticalAlign => 'top', :y => 75, :x => -50, :layout => 'vertical',)
      f.chart({:defaultSeriesType=>"column"})
    end


  end

  def show
  end

  def edit
  end

  def stackedChart
    @totalCategory0 = EmailAggregate.where("category = '0'").sum('frequency')
    @totalCategory1 = EmailAggregate.where("category = '1'").sum('frequency')
    @totalCategory2 = EmailAggregate.where("category = '2'").sum('frequency')
    @totalCategory3 = EmailAggregate.where("category = '3'").sum('frequency')
    @totalCategory4 = EmailAggregate.where("category = '4'").sum('frequency')
    @totalCategory5 = EmailAggregate.where("category = '5'").sum('frequency')
    @totalCategory6 = EmailAggregate.where("category = '6'").sum('frequency')
    @totalCategory7 = EmailAggregate.where("category = '7'").sum('frequency')


    @totalCategory0byMonth = EmailAggregate.where("category = '0'").group('month').order('month ASC').sum('frequency')
    @totalCategory1byMonth = EmailAggregate.where("category = '1'").group('month').order('month ASC').sum('frequency')
    @totalCategory2byMonth = EmailAggregate.where("category = '2'").group('month').order('month ASC').sum('frequency')
    @totalCategory3byMonth = EmailAggregate.where("category = '3'").group('month').order('month ASC').sum('frequency')
    @totalCategory4byMonth = EmailAggregate.where("category = '4'").group('month').order('month ASC').sum('frequency')
    @totalCategory5byMonth = EmailAggregate.where("category = '5'").group('month').order('month ASC').sum('frequency')
    @totalCategory6byMonth = EmailAggregate.where("category = '6'").group('month').order('month ASC').sum('frequency')
    @totalCategory7byMonth = EmailAggregate.where("category = '7'").group('month').order('month ASC').sum('frequency')

    #below hashes return months of data, using @minContact variable to specifiy minimum frequency of contact on a monthly basis to factor in the analysis. It may be interesting to put more variability.
    @monthContactsArr = []
    @months = [1,2,3,4,5,6,7,8,9,10,11,12]
    @months.each do |month|
    @monthContactsArr.push(EmailAggregate.where("month = '?'", month).where("category <> '9999' AND category <> '9998'AND category <> '0'").where("frequency > ?", EmailAggregate::MINCONTACT).group('category').order('category ASC').sum('frequency'))
    end
@monthContactsArrJan = []
@monthContactsArrJan = (EmailAggregate.where("month = '1'").where("category <> '9999' AND category <> '9998'").where("frequency > ?", EmailAggregate::MINCONTACT).group('category').order('category ASC').sum('frequency'))
@monthContactsArrFeb = (EmailAggregate.where("month = '2'").where("category <> '9999' AND category <> '9998'").where("frequency > ?", EmailAggregate::MINCONTACT).group('category').order('category ASC').sum('frequency'))
@monthContactsArrFeb = (EmailAggregate.where("month = '2'").where("category <> '9999' AND category <> '9998'").where("frequency > ?", EmailAggregate::MINCONTACT).group('category').order('category ASC').sum('frequency'))
    @chart1 = LazyHighCharts::HighChart.new('graph') do |f|
      f.title(:text => "Total Volume of Communication across Bridges")
      f.xAxis(:categories => EmailAggregate::MONTHNAMESMODEL)
      f.series(:name => "Capital", :yAxis => 0, :data =>  @totalCategory1byMonth.map)
      f.series(:name => "Company", :yAxis => 0, :data => @totalCategory2byMonth.map)
      f.series(:name => "Research", :yAxis => 0, :data => @totalCategory3byMonth.map)
      f.series(:name => "Public Sector", :yAxis => 0, :data => @totalCategory4byMonth.map)
      f.series(:name => "Cluster", :yAxis => 0, :data => @totalCategory5byMonth.map)
      f.series(:name => "Global Market", :yAxis => 0, :data => @totalCategory6byMonth.map)
      f.series(:name => "Education", :yAxis => 0, :data => @totalCategory7byMonth.map)

      f.yAxis [
        {:title => {:text => "", :margin => 0} },
        {:title => {:text => "Contacts per month"}, :opposite => true},
      ]

      f.legend(:align => 'right', :verticalAlign => 'top', :y => 75, :x => -50, :layout => 'vertical',)
      f.chart({:defaultSeriesType=>"column"})
      f.plot_options({:column=>{:stacking=>"normal"}})
    end
  end

  def delete
  end
end
