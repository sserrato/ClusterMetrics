class ClustersController < ApplicationController
  def new
    @cluster = Cluster.new
  end

  def create
    @cluster = Cluster.new cluster_params
    if @cluster.save
      redirect_to (emails_load_path)
    else
      render 'new'
    end
  end

  def edit
  end

  def index
    @clusters = Cluster.all
  end

  private
  def cluster_params
    params.require(:cluster).permit(:cluster_name)
  end
end
