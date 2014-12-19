Transports = new Mongo.Collection('transports');

Meteor.methods({
  addTransport: function(transport) {
    if (!validate.isNonEmptyText(transport.name)) {
      throw new Meteor.Error("invalid-input", "you have to input a name!");
    }

    transport.prioritised = Boolean(transport.prioritised);

    if (validate.isEmptyText(transport.arrival_date)) {
      if (!validate.isEmptyText(transport.arrival_time)) {
        throw new Meteor.Error("invalid-input", "you have to insert a date if you want to insert arrival time!");
      }
    } else {
      transport.arrival = new Date(Date.parse(transport.arrival_date + " " + transport.arrival_time, "dd.MM.yyyy HH:mm"));
      if(!validate.isDate(transport.arrival)) {
        throw new Meteor.Error("invalid-input", "arrival date invalid!");
      }
    }

    if (validate.isEmptyText(transport.departure_date)) {
      if (!validate.isEmptyText(transport.departure_time)) {
        throw new Meteor.Error("invalid-input", "you have to insert a date if you want to insert departure time!");
      }
    } else {
      transport.departure = new Date(Date.parse(transport.departure_date + " " + transport.departure_time, "dd.MM.yyyy HH:mm"));
      if(!validate.isDate(transport.departure)) {
        throw new Meteor.Error("invalid-input", "departure date invalid!");
      }
    }

    transport = validate.stripTo(transport, ["name", "prioritised", "arrival", "departure", "vendor", "comment", "files"])
    console.log(transport);
    Transports.insert(transport);
    return transport;
  }
});
