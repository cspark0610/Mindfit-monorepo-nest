import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function UniqueField(
  types: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'UniqueField',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          let validPropertiesCount = !value ? 0 : 1;
          validPropertiesCount += types.filter(
            (type) => args.object[type],
          ).length;
          return validPropertiesCount === 1;
        },
      },
    });
  };
}
