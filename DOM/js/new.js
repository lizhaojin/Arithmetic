/**
 * 定义世界的平面图
 * # 代表墙壁或岩石
 * o 代表动物
 *  空格代表空白区
 */
var plan = 
    ["#######################",
     "#    #     #   o     ##",
     "#                     #",
     "#      ###            #",
     "##      #   #  ##     #",
     "###      #        ##  #",
     "#           ##        #",
     "#        o    ##      #",
     "## #                  #",
     "#######################",];

// 标识世界的宽度和高度
function Vector(x, y) {
    this.x = x;
    this.y = y;
}
Vector.prototype.plus = function(other) {
    return new Vector(this.x + other.x, this.y + other.y);
};

function Grid(width, height) {
    this.space = new Array(width * height);
    this.width = width;
    this.height  = height;
}
Grid.prototype.isInside = function(vector) {
    return vector.x >= 0 && vector.x < this.widht &&
            vector.y >= 0 && vector.y < this.height;
};
Grid.prototype.get = function(vector) {
    return this.space[vector.x + this.width * vector.y];
};
Grid.prototype.set = function(vector, value) {
    this.space[vector.x + this.widht * vector.y] = value;
};