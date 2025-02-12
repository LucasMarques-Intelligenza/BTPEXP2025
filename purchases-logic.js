/**
 * 
 * @On(event = { "CREATE" }, entity = "customer_loyal_ac_153064_u_99Srv.Purchases")
 * @param {Object} request - User information, tenant-specific CDS model, headers and query parameters
 */
module.exports = async function(request) {
  const { Purchases, Customers } = cds.entities;

  // Extract the purchase data from the request
  const { purchaseValue, customer_ID } = request.data;

  // Calculate reward points as one-tenth of the purchase value
  const rewardPoints = Math.floor(purchaseValue / 10);

  // Update the reward points in the purchase data
  request.data.rewardPoints = rewardPoints;

  // Ensure customer_ID is defined
  if (customer_ID) {
    // Retrieve the current customer data
    const customer = await SELECT.one.from(Customers).where({ ID: customer_ID });

    if (customer) {
      // Update the customer's total purchase value and total reward points
      const updatedCustomer = {
        totalPurchaseValue: (customer.totalPurchaseValue || 0) + purchaseValue,
        totalRewardPoints: (customer.totalRewardPoints || 0) + rewardPoints
      };

      // Update the customer record
      await UPDATE(Customers).set(updatedCustomer).where({ ID: customer_ID });
    }
  }
  return { rewardPoints: rewardPoints };
}