import { useState } from 'react';
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';
import Button from '../../ui/Button';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

const fakeCart = [
  {
    pizzaId: 12,
    name: 'Mediterranean',
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: 'Vegetale',
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: 'Spinach and Mushroom',
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

function CreateOrder() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  // Getting access to the data connected with route that have the action.
  const formsErrors = useActionData();

  // const [withPriority, setWithPriority] = useState(false);
  const cart = fakeCart;

  return (
    <div>
      <h2>Ready to order? Let's go!</h2>

      <Form method="POST" action="/order/new">
        <div>
          <label>First Name</label>
          <input className='input' type="text" name="customer" required />
        </div>

        <div>
          <label>Phone number</label>
          <div>
            <input className='input' type="tel" name="phone" required />
          </div>
          {formsErrors?.phone && <p>{formsErrors.phone}</p>}
        </div>

        <div>
          <label>Address</label>
          <div>
            <input
              className="input"
              type="text"
              name="address"
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            // value={withPriority}
            // onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority">Want to yo give your order priority?</label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <Button
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Placing order...' : 'Order now'}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export const action = async ({ request }) => {
  // Accessing the request from react router dom
  const formData = await request.formData();
  // Transforming the formData into object
  const data = Object.fromEntries(formData);

  // updating the order
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'on',
  };

  // creating errors and validating phone number
  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      'Please give us your correct phone number. We might need it to contact you.';

  if (Object.keys(errors).length > 0) return errors;

  // if everything is okay, create the order and redirect
  const newOrder = await createOrder(order);
  // redirecting to the new route
  return redirect(`/order/${newOrder.id}`);
};

export default CreateOrder;
