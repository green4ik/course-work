import { Pagination } from "react-bootstrap";

export default function TablePagination({ total, currentPage, onChangePage }) {
  let items = [];

  // Добавляем кнопку "Первая страница"
  items.push(
    <Pagination.First
      key="first"
      disabled={currentPage === 1} // Отключаем кнопку, если мы уже на первой странице
      onClick={() => onChangePage(1)}
    />
  );

  // Добавляем кнопку "Предыдущая"
  items.push(
    <Pagination.Prev
      key="prev"
      disabled={currentPage === 1} // Отключаем кнопку, если мы уже на первой странице
      onClick={() => onChangePage(currentPage - 1)}
    />
  );

  // Добавляем две соседние страницы перед текущей
  if (currentPage > 2) {
    items.push(
      <Pagination.Item key={currentPage - 2} onClick={() => onChangePage(currentPage - 2)}>
        {currentPage - 2}
      </Pagination.Item>
    );
  }
  if (currentPage > 1) {
    items.push(
      <Pagination.Item key={currentPage - 1} onClick={() => onChangePage(currentPage - 1)}>
        {currentPage - 1}
      </Pagination.Item>
    );
  }

  // Добавляем текущую страницу
  items.push(
    <Pagination.Item key={currentPage} active>
      {currentPage}
    </Pagination.Item>
  );

  // Добавляем две соседние страницы после текущей
  if (currentPage < total) {
    items.push(
      <Pagination.Item key={currentPage + 1} onClick={() => onChangePage(currentPage + 1)}>
        {currentPage + 1}
      </Pagination.Item>
    );
  }
  if (currentPage < total - 1) {
    items.push(
      <Pagination.Item key={currentPage + 2} onClick={() => onChangePage(currentPage + 2)}>
        {currentPage + 2}
      </Pagination.Item>
    );
  }

  // Добавляем кнопку "Следующая"
  items.push(
    <Pagination.Next
      key="next"
      disabled={currentPage === total} // Отключаем кнопку, если мы уже на последней странице
      onClick={() => onChangePage(currentPage + 1)}
    />
  );

  // Добавляем кнопку "Последняя страница"
  items.push(
    <Pagination.Last
      key="last"
      disabled={currentPage === total} // Отключаем кнопку, если мы уже на последней странице
      onClick={() => onChangePage(total)}
    />
  );

  return <Pagination variant="dark">{items}</Pagination>;
}
