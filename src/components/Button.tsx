import { Button as ButtonNativeBase, IButtonProps, Heading } from "native-base";

type Props = IButtonProps & {
  title: string;
};

export function Button({ title, ...rest }: Props) {
  return (
    <ButtonNativeBase
      bg="gray.50"
      h={14}
      fontSize="sm"
      rounded="2xl"
      _pressed={{ bg: "gray.25" }}
      {...rest}
    >
      <Heading color="white" fontSize="sm">
        {title}
      </Heading>
    </ButtonNativeBase>
  );
}
