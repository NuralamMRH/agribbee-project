import _mock from '../_mock';
import { randomInArray } from '../utils';

// ----------------------------------------------------------------------

export const _bookings = [...Array(5)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.name.fullName(index),
  avatar: _mock.image.avatar(index),
  checkIn: _mock.time(index),
  checkOut: _mock.time(index),
  phoneNumber: _mock.phoneNumber(index),
  status: randomInArray(['pending', 'un_paid', 'paid']),
  roomType: randomInArray([
    'Daily Catch Auction',
    'Live Auction',
    'Surplus Auction',
    'Future Delivery Auction',
  ]),
}));

export const _bookingsOverview = [...Array(3)].map((_, index) => ({
  status: ['Pending', 'Cancel', 'Done'][index],
  quantity: _mock.number.percent(index) * 1000,
  value: _mock.number.percent(index),
}));

export const _bookingReview = [...Array(5)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.name.fullName(index),
  description: _mock.text.description(index),
  avatar: _mock.image.avatar(index),
  rating: _mock.number.rating(index),
  postedAt: _mock.time(index),
  tags: ['Great Sevice', 'Recommended', 'Best Price'],
}));

export const _bookingNew = [...Array(5)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.name.fullName(index),
  avatar: _mock.image.avatar(index),
  bookdAt: _mock.time(index),
  roomNumber: '10KG/Case',
  roomType: randomInArray([
    'Live Auction',
    'Daily Catch Auction',
    'Surplus Auction',
    'Future Delivery Auction',
  ]),
  person: '3-5',
  cover: `/assets/images/auctions/auction_${index + 1}.jpg`,
  // cover: `/assets/images/rooms/room_${index + 1}.jpg`,
}));
