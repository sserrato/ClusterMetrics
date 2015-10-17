class EmailaggregatesController < ApplicationController
  def new
  end

  def index
    @emails = EmailAggregate.all.order('frequency DESC').limit(100).where("category <> '9999' AND category <> '9998' AND frequency > 4")
    @bridges = [0, 1, 2,3,4,5,6,7,9998,9999]
    @bridgeNames = ['Not Yet Classified','Capital Bridge','Company Bridge','Research Bridge','Public Sector Bridge', 'Cluster Bridge','Global Market Bridge','Education Bridge','Junk']
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
    @months.each do |month|
    @monthContacts[month] = EmailAggregate.where("month = '?'", month).where("category <> '9999' AND category <> '9998'").where("frequency > ?", @minContact).group('category').order('category ASC').sum('frequency')
    end

    @monthContactsJan = EmailAggregate.where("month = '1'").where("category <> '9999' AND category <> '9998'").where("frequency > ?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsFeb = EmailAggregate.where("month = '2' AND category <> '9999' AND category <> '9998'").where("frequency > ?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsMar = EmailAggregate.where("month = '3' AND category <> '9999' AND category <> '9998'").where("frequency > ?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsApr = EmailAggregate.where("month = '4' AND category <> '9999' AND category <> '9998'").where("frequency > ?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsMay = EmailAggregate.where("month = '5' AND category <> '9999' AND category <> '9998'").where("frequency > ?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsJun = EmailAggregate.where("month = '6' AND category <> '9999' AND category <> '9998'").where("frequency > ?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsJul = EmailAggregate.where("month = '7' AND category <> '9999' AND category <> '9998'").where("frequency > ?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsAug = EmailAggregate.where("month = '8' AND category <> '9999' AND category <> '9998'").where("frequency > ?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsSep = EmailAggregate.where("month = '9' AND category <> '9999' AND category <> '9998'").where("frequency > ?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsOct = EmailAggregate.where("month = '10' AND category <> '9999' AND category <> '9998'").where("frequency > ?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsNov = EmailAggregate.where("month = '11' AND category <> '9999' AND category <> '9998'").where("frequency > ?", @minContact).group('category').order('category ASC').sum('frequency')
    @monthContactsDec = EmailAggregate.where("month = '12' AND category <> '9999' AND category <> '9998'").where("frequency > ?", @minContact).group('category').order('category ASC').sum('frequency')

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
  end

  def show
  end

  def edit
  end

  def delete
  end
end
