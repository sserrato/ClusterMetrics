class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  $testVar = {"we" => 3, "so" => 4, "well" => 5}
  @testvarName = "This is test Var Name from the App Controller"
end
