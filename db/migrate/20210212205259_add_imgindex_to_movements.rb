class AddImgindexToMovements < ActiveRecord::Migration[6.1]
  def change
    add_column :movements, :img_index, :int
  end
end
