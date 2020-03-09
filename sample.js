public Long SalesOrderId;

public String documentType; //can be quote, invoice, forecast

public String customerCode;

public String invoiceNumber; //note, for estimate, forecast and recurring just use the id
public String contactPerson;
public String currencyCode;
public String accountNumber;

public Double totalBeforeDiscount;
public Double discountPercentage;
public Double discountAmount;
public Double freightAmount;
public Double totalAmount;
public Double taxAmount;
public Double overallAmount;

public LocalDate estimateDate;
public LocalDate forecastDate;
public LocalDate invoiceDate;
public LocalDate paymentDueDate;

public LocalDate postingDate;
public LocalDate deliveryDate;
public String employeeCode;
