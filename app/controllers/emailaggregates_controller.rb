class EmailaggregatesController < ApplicationController
  def new
  end

  def index
    @emails = EmailAggregate.all.order('frequency DESC').limit(100).where("category <> '9999' AND category <> '9998' AND frequency > 4")
    @totalCategory1 = EmailAggregate.where("category = '4'").sum('category')
  end

  def show
  end

  def edit
  end

  def delete
  end
end
