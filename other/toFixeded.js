function format_number(srcNumber, n) {
    //n是要保留的位数
    var dstNumber = parseFloat(srcNumber);

    if (isNaN(dstNumber)) {
        return srcNumber;
    }

    if (dstNumber >= 0) {
        //关键点
        dstNumber = parseInt(dstNumber * Math.pow(10, n) + 0.5) / Math.pow(10, n);
    } else {
        var tmpDstNumber = -dstNumber;
        dstNumber = parseInt(tmpDstNumber * Math.pow(10, n) + 0.5) / Math.pow(10, n);
    }
    var dstStrNumber = dstNumber.toString();
    var dotIndex = dstStrNumber.indexOf('.');
    if (dotIndex < 0) {
        dotIndex = dstStrNumber.length;
        dstStrNumber += '.';
    }

    while (dstStrNumber.length <= dotIndex + n) {
        dstStrNumber += '0';
    }
    return dstStrNumber;
}
