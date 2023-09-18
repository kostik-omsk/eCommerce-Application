import { useState, useEffect, useRef } from 'react';
import { Pagination as AntPagination } from 'antd';
import styles from './Pagination.module.css';

interface PaginationProps {
  count: number | null;
  loading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const pageSize = 20;

const Pagination = ({ count, loading, currentPage, onPageChange }: PaginationProps) => {
  const [total, setTotal] = useState(count || 0);
  const totalRef = useRef<number>();

  useEffect(() => {
    if (count !== null && count !== totalRef.current) {
      totalRef.current = count;
      setTotal(count);
    }
  }, [count]);

  return (
    <>
      {total ? <h3 className={styles.total}>Total {total} items</h3> : null}
      <AntPagination
        total={total}
        current={currentPage}
        disabled={loading}
        pageSize={pageSize}
        onChange={onPageChange}
        showSizeChanger={false}
        showQuickJumper={total > pageSize * 7}
        hideOnSinglePage
      />
    </>
  );
};

export { Pagination };
