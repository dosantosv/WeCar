import { BackgroundSearch } from "~/components/Images";

export function Jumbotron() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="jumbotron-main">
          <img src={SearchBackground} loading="lazy" alt="" />
        </div>
      </div>
    </div>
  );
}
