class User < ActiveRecord::Base
  belongs_to :cluster
  has_secure_password
  validates :email, presence: true, uniqueness: true
end
