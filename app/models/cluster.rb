class Cluster < ActiveRecord::Base
  has_many :emails
  has_many :users
  has_secure_password
  validates :email, presence: true, uniqueness: true
end
