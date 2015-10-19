class EmailaggregatesController < ApplicationController
  def totalContact

    # monthly contacts grouped by bridge
    @monthContactsJan = EmailAggregate.where("month = '1'").where("category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", EmailAggregate::MINCONTACT).group('category').order('category ASC').sum('frequency')
    @monthContactsFeb = EmailAggregate.where("month = '2' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", EmailAggregate::MINCONTACT).group('category').order('category ASC').sum('frequency')
    @monthContactsMar = EmailAggregate.where("month = '3' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", EmailAggregate::MINCONTACT).group('category').order('category ASC').sum('frequency')
    @monthContactsApr = EmailAggregate.where("month = '4' AND category <> '9999' AND category <> '9998'AND category<> '0' ").where("frequency >=?", EmailAggregate::MINCONTACT).group('category').order('category ASC').sum('frequency')
    @monthContactsMay = EmailAggregate.where("month = '5' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", EmailAggregate::MINCONTACT).group('category').order('category ASC').sum('frequency')
    @monthContactsJun = EmailAggregate.where("month = '6' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", EmailAggregate::MINCONTACT).group('category').order('category ASC').sum('frequency')
    @monthContactsJul = EmailAggregate.where("month = '7' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", EmailAggregate::MINCONTACT).group('category').order('category ASC').sum('frequency')
    @monthContactsAug = EmailAggregate.where("month = '8' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", EmailAggregate::MINCONTACT).group('category').order('category ASC').sum('frequency')
    @monthContactsSep = EmailAggregate.where("month = '9' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", EmailAggregate::MINCONTACT).group('category').order('category ASC').sum('frequency')
    @monthContactsOct = EmailAggregate.where("month = '10' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", EmailAggregate::MINCONTACT).group('category').order('category ASC').sum('frequency')
    @monthContactsNov = EmailAggregate.where("month = '11' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", EmailAggregate::MINCONTACT).group('category').order('category ASC').sum('frequency')
    @monthContactsDec = EmailAggregate.where("month = '12' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", EmailAggregate::MINCONTACT).group('category').order('category ASC').sum('frequency')

    #chart for monthly contacts grouped by bridge
    @totalContactChart = LazyHighCharts::HighChart.new('graph') do |f|
      f.title(:text => "Total # Contacts Per Month across Categories")
      f.xAxis(:categories =>  EmailAggregate::BRIDGENAMESMODEL)
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

  def norms
    @norms = "this is is from def norms"
  end


  def diversity
    #diversity is the unique contacts in a period over the target unique bridge contacts in a period. unique bridge contact goal is specific to the period.
    @monthDistinctDomain = EmailAggregate.select("month").group('domain').distinct.count
    @distinctDomainCountCount = EmailAggregate.select("domain").distinct.where("category <> '9999' AND category <> '9998' AND frequency >=4").group('month').group('category').count
    @distinctDomainCountList = EmailAggregate.select("domain").where("month = '1' AND category <> '9999' AND category <> '9998' AND frequency >=4").group('category').sum('frequency')
    @domainJanListcat2 = EmailAggregate.where("category = '2' AND month = '1'AND frequency >=4").group('domain').order('domain ASC').sum('frequency')
    #all cluster goals.
    @clusterGoals = ClusterClientGoal.where("bridge <> 0 AND bridge <> '9999' AND bridge <> '9998'")
    @divGoalBrige1 = ClusterClientGoal.select("bridge").where("bridge='1'").sum("diversityGoal")
    #all goals specic to bridge:diversity
    @divGoal = ClusterClientGoal.select("bridge").where("bridge <> '0' AND bridge <> '9999' AND bridge <>  '9998'").group("bridge").order("bridge").sum("diversityGoal")

    @distinctBridgeCategories = []
     0.upto(EmailAggregate::BRIDGEVALUEMODEL.length ) do |bvalue|
        @distinctBridgeCategories[bvalue] = EmailAggregate.select("domain").distinct.where("category = '?'",bvalue).where("category <> '9999' AND category <> '9998' AND frequency >=4").group('month').order('month ASC').count
      end

    # Bridge distinct domains by month to be divided by diversity goal per bridge

    @distinctCat1ByMonth = EmailAggregate.select("domain").distinct.where("category = '1' AND category <> '9999' AND category <> '9998' AND frequency >=4").group('month').order('month ASC').count
    @distinctCat2ByMonth = EmailAggregate.select("domain").distinct.where("category = '2' AND category <> '9999' AND category <> '9998' AND frequency >=4").group('month').order('month ASC').count
    @distinctCat3ByMonth = EmailAggregate.select("domain").distinct.where("category = '3' AND category <> '9999' AND category <> '9998' AND frequency >=4").group('month').order('month ASC').count
    @distinctCat4ByMonth = EmailAggregate.select("domain").distinct.where("category = '4' AND category <> '9999' AND category <> '9998' AND frequency >=4").group('month').order('month ASC').count
    @distinctCat5ByMonth = EmailAggregate.select("domain").distinct.where("category = '5' AND category <> '9999' AND category <> '9998' AND frequency >=4").group('month').order('month ASC').count
    @distinctCat6ByMonth = EmailAggregate.select("domain").distinct.where("category = '6' AND category <> '9999' AND category <> '9998' AND frequency >=4").group('month').order('month ASC').count
    @distinctCat7ByMonth = EmailAggregate.select("domain").distinct.where("category = '7' AND category <> '9999' AND category <> '9998' AND frequency >=4").group('month').order('month ASC').count

    # Specifies the minimum contact parameter to include data in the analysis. It is 4 contats within a month reporting period.
    @minContact = 4
    #minContact variable here represents a UX where the user can specify analysis by min contact. They would set the variable and then reload the page to vary the min frequency analysis.
    #counting number of contacts. need to count distinct domains.
  #####  @distinctMonthContactsJan = EmailAggregate.select.("domain").where("month = '1'").where("category <> '9999' AND category <> '9998' AND category<> '0' AND frequency >=?", @minContact).count
#    @distinctContactsJan = EmailAggregate.select.("domain").where("month = '1'").where("category <> '9999' AND category <> '9998' AND category<> '0' AND frequency >=?", @minContact).count
    @distinctJanuary = EmailAggregate.where("month = '1' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", @minContact).group('category').order('category ASC').count
    @distinctJanuary.each do |distinctJan|
      distinctJan
    end
    @monthContactsJan = EmailAggregate.where("month = '1' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsFeb = EmailAggregate.where("month = '2' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsMar = EmailAggregate.where("month = '3' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsApr = EmailAggregate.where("month = '4' AND category <> '9999' AND category <> '9998'AND category<> '0' ").where("frequency >=?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsMay = EmailAggregate.where("month = '5' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsJun = EmailAggregate.where("month = '6' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsJul = EmailAggregate.where("month = '7' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsAug = EmailAggregate.where("month = '8' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsSep = EmailAggregate.where("month = '9' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsOct = EmailAggregate.where("month = '10' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsNov = EmailAggregate.where("month = '11' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsDec = EmailAggregate.where("month = '12' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", @minContact).group('category').order('category ASC').sum('frequency')

    #iterating to get diversity achieved
    #@monthContactsJan.each do | janDiv|
    #@divGoal.each do | divG |
    #  janDiv / divG
    #end
  #end

    #chart for monthly contacts grouped by bridge
    @diversityChart = LazyHighCharts::HighChart.new('graph') do |f|
      f.title(:text => "Contact Gap - Actual vs Goal # Contacts")
      f.xAxis(:categories =>  ["Capital", "Company", "Research", "Public Sector", "Cluster", "Global Market", "Education"])
      f.series(:name => "January", :yAxis => 1, :data => [0.4,0.19,0.13,0.38,0.32,0.43,0.13])
      f.series(:name => "February", :yAxis => 1, :data => [0.2,0.23,0.13,0.35,0.28,0.2,0.13])
      f.series(:name => "March", :yAxis => 1, :data => [0.2,0.18,0.27,0.4,0.2,0.43,0.2])
      f.series(:name => "April", :yAxis => 1, :data =>[0.4,0.14,0.27,0.35,0.32,0.23,0.2])
      f.series(:name => "May", :yAxis => 1, :data => [0.2,0.17,0.2,0.33,0.32,0.37,0.13])
      f.series(:name => "June", :yAxis => 1, :data => [0.2,0.2,0.2,0.35,0.28,0.33,0.07])
      f.series(:name => "July", :yAxis => 1, :data => [0.2,0.13,0.07,0.2,0.16,0.47,0.07])
      f.series(:name => "August", :yAxis => 1, :data => [0.2,0.19,0.07,0.3,0.24,0.4,0.27])
      f.series(:name => "September", :yAxis => 1, :data => [0.4,0.25,0.2,0.35,0.28,0.5,0.4])
      f.series(:name => "October", :yAxis => 1, :data => [0.2,0.21,0.27,0.33,0.2,0.43,0.13])
      f.series(:name => "November", :yAxis => 1, :data => [0.2,0.29,0.2,0.35,0.24,0.67,0.2])
      f.series(:name => "December", :yAxis => 1, :data => [0.4,0.2,0.13,0.35,0.24,0.5,0.13])

      f.yAxis [
        {:title => {:text => "", :margin => 0} },
        {:title => {:text => "% achieved"}, :opposite => true},
      ]
      #f.options[:tooltip][:formatter] = "function(){ return '<b>'+ this.point.name +'</b>: '+ Highcharts.numberFormat(this.percentage, 2) +' %'; }"

      f.legend(:align => 'right', :verticalAlign => 'top', :y => 75, :x => -50, :layout => 'vertical',)
      f.chart({:defaultSeriesType=>"column"})
    end

  end

  def intensity
    @intensityChart = LazyHighCharts::HighChart.new('graph') do |f|
      f.title(:text => "Intensity of Communication Achieved - Actual vs Goal # Contacts")
      f.xAxis(:categories =>  ["Capital", "Company", "Research", "Public Sector", "Cluster", "Global Market", "Education"])
      f.series(:name => "January", :yAxis => 1, :data => [7.5,4.75,4.33,4.25,3.5,3,2])
      f.series(:name => "February", :yAxis => 1, :data => [10,3.5,7,5.25,4,9.5,3.75])
      f.series(:name => "March", :yAxis => 1, :data => [7.83,4.75,3.67,6.5,6,12.5,2.75])
      f.series(:name => "April", :yAxis => 1, :data =>[6.33,6,3.67,6.5,3.5,12.5,1.5])
      f.series(:name => "May", :yAxis => 1, :data => [12.5,4.5,4.33,6.5,3.5,10,2])
      f.series(:name => "June", :yAxis => 1, :data => [14.17,4,4.17,6.75,3.5,8,2.25])
      f.series(:name => "July", :yAxis => 1, :data => [1.33,3.75,1.33,4.5,2.25,8,1.5])
      f.series(:name => "August", :yAxis => 1, :data => [7.17,4.75,8.17,9.5,3.25,8.5,1.5])
      f.series(:name => "September", :yAxis => 1, :data => [4.17,4.25,6.67,11,6.25,7.5,3.25])
      f.series(:name => "October", :yAxis => 1, :data => [16.83,3.75,5.5,8,3.5,9,4])
      f.series(:name => "November", :yAxis => 1, :data => [10.67,3.5,5.67,7.25,1.75,5.5,2])
      f.series(:name => "December", :yAxis => 1, :data => [4.17,3.5,6.33,4.25,2.25,5,2.25])

      f.yAxis [
        {:title => {:text => "", :margin => 0} },
        {:title => {:text => ""}, :opposite => true},
      ]
      #f.options[:tooltip][:formatter] = "function(){ return '<b>'+ this.point.name +'</b>: '+ Highcharts.numberFormat(this.percentage, 2) +' %'; }"

      f.legend(:align => 'right', :verticalAlign => 'top', :y => 75, :x => -50, :layout => 'vertical',)
      f.chart({:defaultSeriesType=>"column"})
    end
      @clusterGoals = ClusterClientGoal.all
      @freqGoalModel = ClusterClientGoal.where("bridge <> '9999' AND bridge <> '9998' AND bridge<> '0'").group('bridge').order('bridge ASC').sum('frequencyGoal')
      @freqGoalModel = ClusterClientGoal.where("bridge <> '9999' AND bridge <> '9998' AND bridge<> '0'").group('bridge').order('bridge ASC').sum('frequencyGoal')
  end

  def averageIntensity
    @averageIntensityChart = LazyHighCharts::HighChart.new('graph') do |f|
      f.title(:text => "Average Intensity of Communication per Contact")
      f.xAxis(:categories =>  ["Capital", "Company", "Research", "Public Sector", "Cluster", "Global Market", "Education"])
      f.series(:name => "January", :yAxis => 1, :data => [45,19,26,17,14,6,8])
      f.series(:name => "February", :yAxis => 1, :data => [60,14,42,21,16,19,15])
      f.series(:name => "March", :yAxis => 1, :data => [47,19,22,26,24,25,11])
      f.series(:name => "April", :yAxis => 1, :data =>[38,24,22,26,14,25,6])
      f.series(:name => "May", :yAxis => 1, :data => [75,18,26,26,14,20,8])
      f.series(:name => "June", :yAxis => 1, :data => [85,16,25,27,14,16,9])
      f.series(:name => "July", :yAxis => 1, :data => [8,15,8,18,9,16,6])
      f.series(:name => "August", :yAxis => 1, :data => [43,19,49,38,13,17,6])
      f.series(:name => "September", :yAxis => 1, :data => [25,17,40,44,25,15,13])
      f.series(:name => "October", :yAxis => 1, :data => [101,15,33,32,14,18,16])
      f.series(:name => "November", :yAxis => 1, :data => [64,14,34,29,7,11,8])
      f.series(:name => "December", :yAxis => 1, :data => [25,14,38,17,9,10,9])

      f.yAxis [
        {:title => {:text => "", :margin => 0} },
        {:title => {:text => "Average Contact per Bridge"}, :opposite => true},
      ]
      #f.options[:tooltip][:formatter] = "function(){ return '<b>'+ this.point.name +'</b>: '+ Highcharts.numberFormat(this.percentage, 2) +' %'; }"

      f.legend(:align => 'right', :verticalAlign => 'top', :y => 75, :x => -50, :layout => 'vertical',)
      f.chart({:defaultSeriesType=>"column"})
    end
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
    @clusterGoals = ClusterClientGoal.where("bridge <> 0 AND bridge <> '9999' AND bridge <> '9998'")
    @emails = EmailAggregate.all.order('frequency DESC').limit(100).where("category <> '9999' AND category <> '9998' AND frequency >=4")
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
    @monthContacts[month] = EmailAggregate.where("month = '?'", month).where("category <> '9999' AND category <> '9998'AND category <> '0'").where("frequency >=?", @minContact).group('category').order('category ASC').sum('frequency')
    end



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
    @distinctDomainCount2 = EmailAggregate.select("domain, category").distinct.where("category <> '9999' AND category <> '9998' AND frequency >=4").order('category ASC')
    @distinctDomainCount3 = EmailAggregate.select("domain").distinct.where("category <> '9999' AND category <> '9998' AND frequency >=4").count
    @distinctDomain = EmailAggregate.select("domain").distinct[1]
    @distinctDomainCountByMonth = EmailAggregate.all.select("domain").group('month').order('month ASC').sum('frequency')
    @totalContactsbyMonth= EmailAggregate.all.group('month').order('month ASC').sum('frequency')

    # monthly contacts grouped by bridge
    @monthContactsJan = EmailAggregate.where("month = '1'").where("category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsFeb = EmailAggregate.where("month = '2' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsMar = EmailAggregate.where("month = '3' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsApr = EmailAggregate.where("month = '4' AND category <> '9999' AND category <> '9998'AND category<> '0' ").where("frequency >=?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsMay = EmailAggregate.where("month = '5' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsJun = EmailAggregate.where("month = '6' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsJul = EmailAggregate.where("month = '7' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsAug = EmailAggregate.where("month = '8' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsSep = EmailAggregate.where("month = '9' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsOct = EmailAggregate.where("month = '10' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsNov = EmailAggregate.where("month = '11' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsDec = EmailAggregate.where("month = '12' AND category <> '9999' AND category <> '9998' AND category<> '0'").where("frequency >=?", @minContact).group('category').order('category ASC').sum('frequency')

    #chart for monthly contacts grouped by bridge
    @chart = LazyHighCharts::HighChart.new('graph') do |f|
      f.title(:text => "Total # Contacts Per Month across Categories")
      f.xAxis(:categories =>  EmailAggregate::BRIDGENAMESMODEL)
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

  def totalVolume
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
    @monthContactsArr.push(EmailAggregate.where("month = '?'", month).where("category <> '9999' AND category <> '9998'AND category <> '0'").where("frequency >=?", EmailAggregate::MINCONTACT).group('category').order('category ASC').sum('frequency'))
    end
@monthContactsArrJan = []
@monthContactsArrJan = (EmailAggregate.where("month = '1'").where("category <> '9999' AND category <> '9998'").where("frequency >=?", EmailAggregate::MINCONTACT).group('category').order('category ASC').sum('frequency'))
@monthContactsArrFeb = (EmailAggregate.where("month = '2'").where("category <> '9999' AND category <> '9998'").where("frequency >=?", EmailAggregate::MINCONTACT).group('category').order('category ASC').sum('frequency'))
@monthContactsArrFeb = (EmailAggregate.where("month = '2'").where("category <> '9999' AND category <> '9998'").where("frequency >=?", EmailAggregate::MINCONTACT).group('category').order('category ASC').sum('frequency'))
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
