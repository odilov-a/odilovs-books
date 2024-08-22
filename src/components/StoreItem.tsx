import { Button, Card } from "react-bootstrap";
import { formatCurrency } from "../utilities/formatCurrency";
import { useShoppingCart } from "../context/ShoppingCartContext";
import "../styles/StoreItem.css"; // Assuming you add custom styles here

type StoreItemProps = {
  id: number;
  name: string;
  price: number;
  imgUrl: string;
};

export function StoreItem({ id, name, price, imgUrl }: StoreItemProps) {
  const {
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    // removeFromCart,
  } = useShoppingCart();
  const quantity = getItemQuantity(id);

  return (
    <Card className="h-100 text-center border-0 shadow-sm rounded-3 small-card">
      <Card.Img
        variant="top"
        src={imgUrl}
        height="150px"
        className="rounded-top"
        style={{ objectFit: "contain", padding: "0.5rem" }}
      />
      <Card.Body className="d-flex flex-column p-2">
        <Card.Title className="mb-2">
          <span className="fs-6 text-muted">{formatCurrency(price)}</span>
        </Card.Title>
        <Card.Text className="text-truncate mb-3" style={{ fontSize: "0.8rem" }}>
          {name}
        </Card.Text>
        <div className="mt-auto">
          {quantity === 0 ? (
            <Button
              className="w-100 btn-dark rounded-pill py-1"
              onClick={() => increaseCartQuantity(id)}
              style={{ fontSize: "0.8rem" }}
            >
              Savatga
            </Button>
          ) : (
            <div className="d-flex align-items-center justify-content-center" style={{ gap: "0.3rem" }}>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => decreaseCartQuantity(id)}
                className="quantity-button"
              >
                -
              </Button>
              <div className="quantity-display">
                <span className="fs-6">{quantity}</span>
              </div>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => increaseCartQuantity(id)}
                className="quantity-button"
              >
                +
              </Button>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
